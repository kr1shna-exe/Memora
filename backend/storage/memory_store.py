import uuid
from exports.types import Memory, MemoryType
from utils.embeddings import EmbeddingGenerator
from vector_store import VectorStore
from typing import List, Optional

class MemoryStore:
    def __init__(self, collection_name: str = "memories"):
        self.vector = VectorStore()
        self.embed = EmbeddingGenerator()

    def store_memory(self, memory: Memory):
        try:
            embed_content = self.embed.generate_embeddings(memory.content)
            point_id = str(uuid.uuid4())
            payload = {
                "userid": memory.user_id,
                "memory_type": memory.memory_type.value,
                "content": memory.content,
                "timestamp": memory.timestamp.isoformat()
                }
            self.vector.add_vector(
                    point_id=point_id,
                    vector=embed_content,
                    payload=payload
                    )
            return point_id
        except Exception as e:
            print(f"Error while storing memory: {str(e)}")

    def search_memories(self, query: str, user_id: str, memory_type: Optional[MemoryType] = None):
        
