from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from config.settings import settings
from exports.types import GeminiModel, GroqModel, LLMProvider, OpenAIModel

class LLMClient():
    def __init__(self, provider: LLMProvider, model: str | None = None):
        self.provider = provider
        self.model_name = model
        self.model = self._initialize_model()

    def _initialize_model(self):
        if self.provider == LLMProvider.GEMINI:
            model = self.model_name or GeminiModel.FLASH.value
            return ChatGoogleGenerativeAI(
                    model=model,
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.2
                    )
        elif self.provider == LLMProvider.GROQ:
            model = self.model_name or GroqModel.LLAMA_70B.value
            return ChatGroq(
                    model=model,
                    api_key=settings.GROQ_API_KEY,
                    temperature=0.2
                    )
        elif self.provider == LLMProvider.OPENAI:
            model = self.model_name or OpenAIModel.GPT_4O_MINI.value
            return ChatOpenAI(
                    model=model,
                    api_key=settings.OPENAI_API_KEY,
                    temperature=0.2
                    )
        else:
            raise ValueError(f"Unsupported Provider: {self.provider}")

    async def invoke(self, prompt: str):
        response = await self.model.ainvoke(prompt)
        return response.content

    async def stream(self, prompt: str):
        async for chunk in self.model.astream(prompt):
            if chunk.content and isinstance(chunk.content, str):
                yield chunk.content
    
    def get_chat_model(self):
        return self.model
