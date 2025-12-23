from typing import Sequence
from langchain.tools import tool
from exports.types import Memory
from memory.episodic_mem import EpisodicMemory
from datetime import datetime

def format_memories_for_llm(memories: Sequence[Memory]) -> str:
    if not memories:
        return "No memories found"
    
    formatted = []
    for i,mem in enumerate(memories, start=1):
        formatted.append(
                f"{i}. [{mem.timestamp.strftime('%Y-%m-%d')}] {mem.content}"
                )
    return "\n".join(formatted)

@tool
def get_recent_memories(user_id: str, days: int = 7) -> str:
    """Get recent memories from last N days

    Use this tool when the user asks about:
    - Recent events ("what did i do recently", "what happened yesterday")
    - Last week's activities
    - Things from the past few days

    Args:
        user_id: The user's unique identifier
        days: Number of days to look back (default: 7)

    Returns:
        Formatted string of recent memories
    """
    episodic = EpisodicMemory()
    memories = episodic.get_recent_memory(user_id, days)
    return format_memories_for_llm(memories)


@tool
def get_memories_by_date_range(user_id: str, start_date: str, end_date: str) -> str:
    """Get memories between specific dates.

    Use this tool when the user mentions specific dates or time periods:
    - "What happened in March?"
    - "Show me conversations from last week"
    - "What did we discuss between Jan 1 and Jan 15?"

    Args:
        user_id: The user's unique identifier
        start_date: Start date in ISO format (YYYY-MM-DD)
        end_date: End date in ISO format (YYYY-MM-DD)

    Returns:
        Formatted string of memories in the date range
    """
    episodic = EpisodicMemory()
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    memories = episodic.get_by_date_range(user_id, start, end)
    return format_memories_for_llm(memories)


@tool
def search_memories_with_recency(user_id: str, query: str) -> str:
    """Search memories semantically with recency boost.

    Use this tool for general topic searches where recent memories
    should be prioritized:
    - "Tell me about my pizza preferences"
    - "What do you know about my work?"
    - "Find memories about Python programming"

    Args:
        user_id: The user's unique identifier
        query: The search query

    Returns:
        Formatted string of relevant memories (recent ones ranked higher)
    """
    episodic = EpisodicMemory()
    memories = episodic.search_with_recency_score(user_id, query)
    return format_memories_for_llm(memories)
