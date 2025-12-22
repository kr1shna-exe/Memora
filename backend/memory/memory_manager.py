from exports.types import Memory
from update.updater import MemoryUpdater
from utils.extractor import MemoryExtractor
from typing import List, Dict

class MemoryManager:
    def __init__(self):
        self.extractor = MemoryExtractor()
        self.updater = MemoryUpdater()

    async def add_conversation(self, messages: List[Dict[str, str]], user_id: str):
        new_memories = await self.extractor.extract_from_conversation(messages, user_id)
        result = await self.updater.update_memories(new_memories, user_id)
        return result
