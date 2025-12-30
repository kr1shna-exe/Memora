from llm.orchestrator import LLMOrchestrator
from tools.memory_tools import ( get_recent_memories, get_memories_by_date_range, search_memories_with_recency )
from exports.types import LLMProvider
from langchain.agents import create_agent
from typing import Dict

class MemoryAgent:
    def __init__(self, provider: LLMProvider = LLMProvider.GEMINI, system_prompt: str | None = None, user_patterns: Dict | None = None):
        self.llm_orchestrator = LLMOrchestrator()
        self.provider = provider
        self.tools = [
                get_recent_memories,
                get_memories_by_date_range,
                search_memories_with_recency
                ]
        if system_prompt:
            self.system_prompt = system_prompt
        else:
            self.system_prompt = """ You are a memory retrieval assistant. Use the available tools to find relevant memories for the user.

            When the user asks about:
            - Recent events (yesterday, last week, recently) → use get_recent_memories
            - Specific dates or date ranges (in March, between Jan 1-15) → use get_memories_by_date_range
            - Topics or general questions (about pizza, work, Python) → use search_memories_with_recency

            Always extract user_id from the input and pass it to the tools"""

        if user_patterns:
            self.system_prompt = self._enhance_prompt_with_patterns(
                    self.system_prompt,
                    user_patterns
                    )
        llm = self.llm_orchestrator.get_agent_model(provider=self.provider)
        self.agent = create_agent(
                model=llm,
                tools=self.tools,
                system_prompt=self.system_prompt
                )
    
    async def query(self, user_query: str, user_id: str) -> str:
        full_query = f"User ID: {user_id}\nQUERY: {user_query}"
        result = await self.agent.ainvoke({
            "messages": [{"role": "user", "content": full_query}]
            })
        return result["messages"][-1].content

    def _enhance_prompt_with_patterns(self, base_prompt: str, patterns: Dict) -> str:
        """Adding user patterns to system prompt"""
        enhanced = base_prompt + "\n\n## USER PROFILE:\n"
        prefs = patterns.get("preferences", {}).get("strong_preferences", [])
        if prefs:
            enhanced += "\n### User Preferences:\n"
            for pref in prefs[:5]:  # Top 5
                enhanced += f"- {pref.get('preference', 'Unknown')}\n"

        style = patterns.get("conversation_style", {}).get("communication_style", {})
        if style:
            enhanced += f"\n### Communication Style:\n"
            enhanced += f"- Preferred detail level: {style.get('preferred_detail_level', 'balanced')}\n"
            enhanced += f"- Technicality: {style.get('technicality', 'moderate')}\n"

        suggestions = patterns.get("conversation_style", {}).get("adaptation_suggestions", [])
        if suggestions:
            enhanced += f"\n### Adaptation Guidelines:\n"
            for suggestion in suggestions[:3]:  # Top 3
                enhanced += f"- {suggestion}\n"

        return enhanced
