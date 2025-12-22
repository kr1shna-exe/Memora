from typing import List
from exports.types import Memory, MemoryType
from llm.orchestrator import LLMOrchestrator
from llm.prompts import DEFAULT_UPDATE_MEMORY_PROMPT
from storage.memory_store import MemoryStore
from datetime import datetime
import json


class MemoryUpdater():
    def __init__(self):
        self.llm_orchestrator = LLMOrchestrator()
        self.deduplicator = MemoryUpdater()
        self.memory_store = MemoryStore()

    async def update_memories(self, new_memories: List[Memory], user_id: str):
        existing_memories = self.memory_store.user_memories(user_id)        
        if not existing_memories:
            for memory in new_memories:
                self.memory_store.store_memory(memory)
            return {
                    "added": new_memories,
                    "updated": [],
                    "deleted": [],
                    "unchanges": []
                    }
        old_memory = [
                {"id": memory.id, "content": memory.content}
                for memory in existing_memories
                ]
        new_facts = [memory.content for memory in new_memories]
        prompt = f"""{DEFAULT_UPDATE_MEMORY_PROMPT}

        Old Memory:
        {json.dumps(old_memory, indent=2)}

        Retrieved Facts: {json.dumps(new_facts)}

        Return updated memory:
        """
        llm_response = await self.llm_orchestrator.ai_invoke(prompt)

        parsed = json.loads(llm_response)
        memory_updates = parsed["memory"]

        added = []
        updated = []
        deleted = []
        unchanged = []
        for item in memory_updates:
            event = item["event"]
            if event == "ADD":
                new_mem = Memory(
                        id=item["id"],
                        user_id=user_id,
                        timestamp=datetime.now(),
                        content=item["content"],
                        memory_type=MemoryType.SEMANTIC,
                        metadata={}
                        )
                self.memory_store.store_memory(new_mem)
                added.append(new_mem)

            elif event == "UPDATE":
                for mem in existing_memories:
                    if mem.content == item.content:
                        self.memory_store.delete_memory(mem.id)
                updated_mem = Memory(
                        id=item["id"],
                        user_id=user_id,
                        timestamp=datetime.now(),
                        content=item["content"],
                        memory_type=MemoryType.SEMANTIC,
                        metadata={}
                        )
                self.memory_store.store_memory(updated_mem)
                updated.append(updated_mem)

            elif event == "DELETED":
                self.memory_store.delete_memory(item["id"])
                deleted.append(...)

            elif event == "NONE":
                unchanged.append(...)
        return {
                "added": added,
                "updated": updated,
                "deleted": deleted,
                "unchanged": unchanged
                }
