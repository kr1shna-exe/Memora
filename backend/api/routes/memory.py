from fastapi import FastAPI, APIRouter
from exports.types import ConversationRequest, SearchRequest
from memory.memory_manager import MemoryManager
from memory.procedural_mem import ProceduralMemory
from storage.memory_store import MemoryStore

router = APIRouter()

@router.post("/add")
async def add_memory(request: ConversationRequest):
    manager = MemoryManager()    
    result = await manager.add_conversation(request.messages, request.user_id)
    return result

@router.post("/search")
async def search_memory(request: SearchRequest):
    store = MemoryStore()
    memories = store.search_memories(request.query, request.user_id)
    return {"memories": [mem.model_dump() for mem in memories]}

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
