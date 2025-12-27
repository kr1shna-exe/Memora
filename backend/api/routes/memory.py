from fastapi import APIRouter
from memory.procedural_mem import ProceduralMemory
from storage.memory_store import MemoryStore

router = APIRouter()

@router.get("/patterns/{user_id}")
async def get_patterns(user_id: str):
    procedural = ProceduralMemory()
    patterns = await procedural.get_comprehensive_patterns(user_id)
    return patterns

@router.get("/all/{user_id}")
async def get_all_memories(user_id: str):
    stored_memories = MemoryStore()
    user_memories = stored_memories.user_memories(user_id)
    return {"memories": [mem.model_dump() for mem in user_memories]}
