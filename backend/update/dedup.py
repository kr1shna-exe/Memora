from typing import List
from exports.types import Memory
from storage.memory_store import MemoryStore


class MemoryDeduplicator:
    def __init__(self, similiarity_threshold: float = 0.8):
        self.similiarity_threshold = similiarity_threshold
        self.memory_store = MemoryStore()

    def find_similiar_memories(self, new_memory: Memory, user_id: str):
        results = self.memory_store.search_memories_with_scores(query=new_memory.content, user_id=user_id)
        similiarity = []
        for result in results:
            if result.score >= self.similiarity_threshold:
                similiarity.append(result.score)
        return similiarity
