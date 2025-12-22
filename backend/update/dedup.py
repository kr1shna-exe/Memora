from typing import List
from exports.types import Memory
from storage.memory_store import MemoryStore


class MemoryDeduplicator:
    def __init__(self, similarity_threshold: float = 0.8):
        self.similarity_threshold = similarity_threshold
        self.memory_store = MemoryStore()

    def find_similar_memories(self, new_memory: Memory, user_id: str):
        results = self.memory_store.search_memories_with_scores(query=new_memory.content, user_id=user_id)
        similarity = []
        for memory in results:
            if memory.score >= self.similarity_threshold:
                similarity.append(memory)
        return similarity
