from fastapi import APIRouter, Depends, HTTPException, Request
from api.controllers.auth import get_current_user_id
from memory.procedural_mem import ProceduralMemory
from storage.memory_store import MemoryStore

router = APIRouter()

@router.get("/patterns")
async def get_patterns(user_id: str = Depends(get_current_user_id)):
    procedural = ProceduralMemory()
    patterns = await procedural.get_comprehensive_patterns(user_id)
    return patterns

@router.get("/all")
async def get_all_memories(user_id: str = Depends(get_current_user_id)):
    stored_memories = MemoryStore()
    user_memories = stored_memories.user_memories(user_id)
    return {"memories": [mem.model_dump() for mem in user_memories]}

@router.delete("/{memory_id}")
async def delete_memory(memory_id: str, user_id: str = Depends(get_current_user_id)):
    store = MemoryStore()
    deleted = store.delete_user_memory(memory_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Memory not found or not authorized")
    return { "message": "Memory deleted"}
