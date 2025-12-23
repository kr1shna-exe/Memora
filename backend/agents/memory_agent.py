from llm.orchestrator import LLMOrchestrator
from tools.memory_tools import ( get_recent_memories, get_memories_by_date_range, search_memories_with_recency )
from exports.types import LLMProvider
from langchain.agents import create_agent

class MemoryAgent:
    def __init__(self, provider: LLMProvider = LLMProvider.GEMINI):
        self.llm_orchestrator = LLMOrchestrator()
        self.provider = provider
        self.tools = [
                get_recent_memories,
                get_memories_by_date_range,
                search_memories_with_recency
                ]
        self.system_prompt = """ You are a memory retrieval assistant. Use the available tools to find relevant memories for the user.

        When the user asks about:
        - Recent events (yesterday, last week, recently) → use get_recent_memories
        - Specific dates or date ranges (in March, between Jan 1-15) → use get_memories_by_date_range
        - Topics or general questions (about pizza, work, Python) → use search_memories_with_recency

        Always extract user_id from the input and pass it to the tools"""
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

