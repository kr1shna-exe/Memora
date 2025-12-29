from exports.types import GeminiModel, GroqModel, LLMProvider, OpenAIModel
from llm.providers import LLMClient


class LLMOrchestrator:
    def __init__(self, default_provider: LLMProvider = LLMProvider.GROQ, default_model: dict[LLMProvider, str] | None = None):
        self.default_provider = default_provider
        self.default_model = default_model or {
                LLMProvider.GEMINI: GeminiModel.FLASH.value,
                LLMProvider.GROQ: GroqModel.LLAMA_70B.value,
                LLMProvider.OPENAI: OpenAIModel.GPT_4O_MINI.value
                }

    def _model_selection(self, text: str):
        return LLMProvider.GROQ, GroqModel.LLAMA_70B.value

    async def ai_invoke(self, prompt: str, provider = None, model_name = None):
        if provider is None or model_name is None:
            auto_provider, auto_model = self._model_selection(prompt)
            provider = provider or auto_provider
            model_name = model_name or auto_model
        client = LLMClient(provider=provider, model=model_name)
        return await client.invoke(prompt)

    async def ai_stream(self, prompt: str, provider = None, model_name = None):
        if provider is None or model_name is None:
            auto_provider, auto_model = self._model_selection(prompt)
            provider = provider or auto_provider
            model_name = model_name or auto_model
        client = LLMClient(provider=provider, model=model_name)
        async for chunk in client.stream(prompt):
            yield chunk

    def get_agent_model(self, provider: LLMProvider | None = None, model_name: str | None = None):
        if provider is None:
            provider = self.default_provider
        if model_name is None:
            model_name = self.default_model[provider]
        client = LLMClient(provider=provider, model=model_name)
        return client.get_chat_model()
