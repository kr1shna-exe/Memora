from exports.parser import normalize_llm_response, parse_extracted_response
from exports.types import Memory, MemoryType
from llm.orchestrator import LLMOrchestrator
from llm.prompts import USER_MEMORY_EXTRACTION_PROMPT
from datetime import datetime
from typing import Dict, List
import uuid

class MemoryExtractor:
    def __init__(self):
        self.llm_orchestrator = LLMOrchestrator()
        self.prompt_template = USER_MEMORY_EXTRACTION_PROMPT

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

    def _facts_to_memories(self, facts: List[str], user_id: str) -> List[Memory]:
        memories = []
        for fact in facts:
            memory = Memory(
                    id=str(uuid.uuid4()),
                    content=fact,
                    memory_type=MemoryType.SEMANTIC,
                    user_id=user_id,
                    metadata={},
                    timestamp=datetime.now()
                    )
            memories.append(memory)
        return memories


    async def extract_from_conversation(self, messages, user_id):
        conversation_text = self._format_conversation(messages)
        full_prompt = f"{USER_MEMORY_EXTRACTION_PROMPT}\n\n{conversation_text}"
        llm_response = await self.llm_orchestrator.ai_invoke(full_prompt)
        normalized_response = normalize_llm_response(llm_response)
        extraction = parse_extracted_response(normalized_response)
        memories = self._facts_to_memories(extraction.facts, user_id)
        return memories
