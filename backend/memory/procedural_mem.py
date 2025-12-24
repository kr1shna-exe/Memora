from llm.orchestrator import LLMOrchestrator
from llm.prompts import PATTERN_DETECTION_PROMPT, PREFERENCE_ANALYSIS_PROMPT, CONVERSATION_STYLE_ANALYSIS_PROMPT
from storage.memory_store import MemoryStore
from exports.parser import normalize_llm_response
from typing import List, Dict
from exports.types import MemoryType
import json

class ProceduralMemory:
    def __init__(self):
        self.memory_store = MemoryStore()
        self.llm_orchestrator = LLMOrchestrator()

    def _format_memories_for_analysis(self, memories: List):
        formatted = []
        for i,mem in enumerate(memories, start=1):
            formatted.append(
                    f"{i}. [{mem.timestamp.strftime('%Y-%m-%d %H:%M')}] "
                    f"({mem.memory_type.value}) {mem.content}"
                    )
        return "\n".join(formatted)

    async def detect_patterns(self, user_id: str):
        memories = self.memory_store.user_memories(user_id)
        if not memories:
            return {
                    "preferences": [],
                    "behavioral_patterns": [],
                    "topic_clusters": [],
                    "conversation_traits": []
                    }
        formatted_memories = self._format_memories_for_analysis(memories)
        full_prompt = f"{PATTERN_DETECTION_PROMPT}\n\n{formatted_memories}"
        llm_response = await self.llm_orchestrator.ai_invoke(full_prompt)
        normalized_response = normalize_llm_response(llm_response)
        try:
            patterns = json.loads(normalized_response)
            return patterns
        except Exception as e:
            print(f"Error parsing the pattern detection logic: {str(e)}")
            return {
                    "preferences": [],
                    "behavioral_patterns": [],
                    "topic_clusters": [],
                    "conversation_traits": []
                    }

    async def analyze_preferences(self, user_id: str):
        memories = self.memory_store.user_memories(user_id)
        if not memories:
            return {
                "strong_preferences": [],
                "moderate_interests": [],
                "emerging_interests": [],
                "dislikes": [],
                "preference_evolution": []
            }
        formatted_memories = self._format_memories_for_analysis(memories)
        full_prompt = f"{PREFERENCE_ANALYSIS_PROMPT}\n\n{formatted_memories}"

        llm_response = await self.llm_orchestrator.ai_invoke(full_prompt)
        normalized_response = normalize_llm_response(llm_response)

        try:
            preferences = json.loads(normalized_response)
            return preferences
        except json.JSONDecodeError as e:
            print(f"Error parsing preference analysis: {e}")
            return {
                "strong_preferences": [],
                "moderate_interests": [],
                "emerging_interests": [],
                "dislikes": [],
                "preference_evolution": []
            }

    async def analyze_conversation_style(self, user_id: str) -> Dict:
        memories = self.memory_store.user_memories(user_id, memory_type=MemoryType.EPISODIC)
        if not memories:
            return {
                "communication_style": {},
                "question_patterns": {},
                "response_preferences": {},
                "engagement_patterns": {},
                "adaptation_suggestions": []
            }

        formatted_memories = self._format_memories_for_analysis(memories)
        full_prompt = f"{CONVERSATION_STYLE_ANALYSIS_PROMPT}\n\n{formatted_memories}"

        llm_response = await self.llm_orchestrator.ai_invoke(full_prompt)
        normalized_response = normalize_llm_response(llm_response)

        try:
            style_analysis = json.loads(normalized_response)
            return style_analysis
        except json.JSONDecodeError as e:
            print(f"Error parsing conversation style analysis: {e}")
            return {
                "communication_style": {},
                "question_patterns": {},
                "response_preferences": {},
                "engagement_patterns": {},
                "adaptation_suggestions": []
            }

    async def get_comprehensive_patterns(self, user_id: str) -> Dict:
        patterns = await self.detect_patterns(user_id)
        preferences = await self.analyze_preferences(user_id)
        conversation_style = await self.analyze_conversation_style(user_id)

        return {
            "patterns": patterns,
            "preferences": preferences,
            "conversation_style": conversation_style
        }


