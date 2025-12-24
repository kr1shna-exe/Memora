from exports.parser import normalize_llm_response
from exports.types import Memory, MemoryExtractionWithTypes, MemoryType
from llm.orchestrator import LLMOrchestrator
from llm.prompts import MEMORY_EXTRACTION_WITH_TYPES_PROMPT
from datetime import datetime
from typing import Dict, List
import uuid, json

class MemoryExtractor:
    def __init__(self):
        self.llm_orchestrator = LLMOrchestrator()

    def _format_conversation(self, messages: List[Dict]):
        text_format: str = ''
        for msg in messages:
            role = msg.get("role")
            content = msg.get("content")
            if role == "user":
                text_format += f"User: {content}\n"
            elif role == "assistant":
                text_format += f"Assistant: {content}\n"
        return text_format.strip()

    def _extraction_to_memories(self, extraction: MemoryExtractionWithTypes, user_id: str) -> List[Memory]:
        memories = []
        for item in extraction.memories:
            if item.type.lower() == "semantic":
                memory_type = MemoryType.SEMANTIC
            elif item.type.lower() == "episodic":
                memory_type = MemoryType.EPISODIC
            else:
                memory_type = MemoryType.SEMANTIC
            memory = Memory(
                    id=str(uuid.uuid4()),
                    content=item.content,
                    memory_type=memory_type,
                    user_id=user_id,
                    metadata={},
                    timestamp=datetime.now()
                    )
            memories.append(memory)
        return memories


    async def extract_from_conversation(self, messages, user_id):
        conversation_text = self._format_conversation(messages)
        full_prompt = f"{MEMORY_EXTRACTION_WITH_TYPES_PROMPT}\n\n{conversation_text}"
        llm_response = await self.llm_orchestrator.ai_invoke(full_prompt)
        normalized_response = normalize_llm_response(llm_response)
        try:
            parsed = json.loads(normalized_response)
            extraction = MemoryExtractionWithTypes.model_validate(parsed)
            memories = self._extraction_to_memories(extraction, user_id)
            return memories
        except Exception as e:
            print(f"Error while extracting memory from the conversation: {str(e)}")
            return []
