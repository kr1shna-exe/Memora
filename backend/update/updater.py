from typing import List
from exports.parser import normalize_llm_response
from exports.types import Memory, MemoryType
from llm.orchestrator import LLMOrchestrator
from llm.prompts import DEFAULT_UPDATE_MEMORY_PROMPT
from storage.memory_store import MemoryStore
from datetime import datetime
from update.dedup import MemoryDeduplicator
import json

class MemoryUpdater():
    def __init__(self):
        self.llm_orchestrator = LLMOrchestrator()
        self.deduplicator = MemoryDeduplicator()
        self.memory_store = MemoryStore()

    async def update_memories(self, new_memories: List[Memory], user_id: str):
        if not new_memories:
            return {
                    "added": [],
                    "updated": [],
                    "deleted": [],
                    "unchanged": []
                    }
        existing_memories = self.memory_store.user_memories(user_id)        
        if not existing_memories:
            for memory in new_memories:
                self.memory_store.store_memory(memory)
            return {
                    "added": new_memories,
                    "updated": [],
                    "deleted": [],
                    "unchanged": []
                    }
        similar = []
        for new_mem in new_memories:
            similar.extend(self.deduplicator.find_similar_memories(new_mem, user_id))
        old_memory = [
                {"id": memory.id, "content": memory.content}
                for memory in similar
                ]
        new_facts = [memory.content for memory in new_memories]
        prompt = f"""{DEFAULT_UPDATE_MEMORY_PROMPT}

        Old Memory:
        {json.dumps(old_memory, indent=2)}

        Retrieved Facts: {json.dumps(new_facts)}

        Return updated memory:
        """
        llm_response = await self.llm_orchestrator.ai_invoke(prompt)
        normalized_response = normalize_llm_response(llm_response)
        parsed = json.loads(normalized_response)
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
                        content=item["text"],
                        memory_type=MemoryType.SEMANTIC,
                        metadata={}
                        )
                self.memory_store.store_memory(new_mem)
                added.append(new_mem)

            elif event == "UPDATE":
                for mem in existing_memories:
                    if mem.content == item.get("old_memory"):
                        self.memory_store.delete_memory(mem.id)
                        break
                updated_mem = Memory(
                        id=item["id"],
                        user_id=user_id,
                        timestamp=datetime.now(),
                        content=item["text"],
                        memory_type=MemoryType.SEMANTIC,
                        metadata={}
                        )
                self.memory_store.store_memory(updated_mem)
                updated.append(updated_mem)

            elif event == "DELETE":
                memory_id = item["id"]
                deleted_memory = None
                for mem in existing_memories:
                    if mem.id == memory_id:
                        deleted_memory = mem
                self.memory_store.delete_memory(item["id"])
                if deleted_memory:
                    deleted.append(deleted_memory)

            elif event == "NONE":
                memory_id = item["id"]
                for mem in existing_memories:
                    if mem.id == memory_id:
                        unchanged.append(mem)
                        break
        return {
                "added": added,
                "updated": updated,
                "deleted": deleted,
                "unchanged": unchanged
                }
