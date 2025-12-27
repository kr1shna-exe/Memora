from datetime import datetime
import uuid
from exports.types import Memory, MemorySearchResult, MemoryType
from utils.embeddings import EmbeddingGenerator
from storage.vector_store import VectorStore
from qdrant_client.models import FieldCondition, Filter, MatchValue, Condition, ScoredPoint
from typing import List, Optional, cast

class MemoryStore:
    def __init__(self, collection_name: str = "memories"):
        self.vector_store = VectorStore()
        self.embed = EmbeddingGenerator()

    def store_memory(self, memory: Memory):
        try:
            embed_content = self.embed.generate_embeddings(memory.content)
            point_id = str(uuid.uuid4())
            payload = {
                "user_id": memory.user_id,
                "memory_type": memory.memory_type.value,
                "content": memory.content,
                "timestamp": memory.timestamp.isoformat()
                }
            self.vector_store.add_vector(
                    point_id=point_id,
                    vector=embed_content,
                    payload=payload
                    )
            return point_id
        except Exception as e:
            print(f"Error while storing memory: {str(e)}")

    def search_memories(self, query: str, user_id: str, memory_type: Optional[MemoryType] = None, limit: int = 5):
        try:
            embed_query = self.embed.generate_embeddings(query)
            must_conditions: list[Condition] = [
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                        )
                    ]
            if memory_type:
                must_conditions.append(
                        FieldCondition(
                            key="memory_type",
                            match=MatchValue(value=memory_type.value)
                        )
                    )
            filter_ = Filter(must=must_conditions)
            results = self.vector_store.search(
                    vector=embed_query,
                    filter_=filter_,
                    limit=limit
                    )

            memories: List[Memory] = []

            for point in results:
                point = cast(ScoredPoint, point)
                payload = point.payload or {}
                memories.append(
                        Memory(
                            id=str(point.id),
                            content=payload["content"],
                            memory_type=MemoryType(payload["memory_type"]),
                            metadata=payload.get("metadata", {}),
                            user_id=payload["user_id"],
                            timestamp=datetime.fromisoformat(payload["timestamp"])
                            )
                        )
            return memories
        except Exception as e:
            print(f"Error while searching & storing in memory: {str(e)}")
            return []

    def user_memories(self, user_id: str, memory_type: Optional[MemoryType] = None):
        try:
            must_conditions: list[Condition] = [
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                        )
                    ]
            if memory_type:
                must_conditions.append(
                        FieldCondition(
                            key="memory_type",
                            match=MatchValue(value=memory_type.value)
                            )
                        )

            filter_ = Filter(must=must_conditions)
            results = self.vector_store.vector_scroll(
                    filter_ = filter_,
                    limit=50
                    )

            memories: List[Memory] = []
            for point in results:
                point = cast(ScoredPoint, point)
                payload = point.payload or {}
                memories.append(
                        Memory(
                            id=str(point.id),
                            content=payload["content"],
                            user_id=payload["user_id"],
                            memory_type=MemoryType(payload["memory_type"]),
                            timestamp=datetime.fromisoformat(payload["timestamp"]),
                            metadata=payload.get("metadata", {})
                            )
                        )
            return memories
        except Exception as e:
            print(f"Error while fetching user memories: {str(e)}")
            return []

    def delete_memory(self, memory_id: str):
        self.vector_store.delete(memory_id)

    def delete_user_memory(self, memory_id: str, user_id: str):
        try:
            result = self.vector_store.get_by_id(memory_id)
            if not result:
                return False
            payload = result.payload or {}
            if payload.get("user_id") != user_id:
                return False
            self.vector_store.delete(memory_id)
            return True
        except Exception as e:
            print(f"Error deleting Memory: {str(e)}")
            return False

    def search_memories_with_scores(self, query: str, user_id: str, memory_type: Optional[MemoryType] = None, limit: int = 5):
        try:
            embed_query = self.embed.generate_embeddings(query)
            must_conditions: list[Condition] = [
                    FieldCondition(
                        key="user_id",
                        match=MatchValue(value=user_id)
                        )
                    ]
            if memory_type:
                must_conditions.append(
                        FieldCondition(
                            key="memory_type",
                            match=MatchValue(value=memory_type.value)
                        )
                    )
            filter_ = Filter(must=must_conditions)
            results = self.vector_store.search(
                    vector=embed_query,
                    filter_=filter_,
                    limit=limit
                    )

            memories: List[MemorySearchResult] = []

            for point in results:
                point = cast(ScoredPoint, point)
                payload = point.payload or {}
                memories.append(
                        MemorySearchResult(
                            id=str(point.id),
                            content=payload["content"],
                            memory_type=MemoryType(payload["memory_type"]),
                            metadata=payload.get("metadata", {}),
                            score=point.score,
                            user_id=payload["user_id"],
                            timestamp=datetime.fromisoformat(payload["timestamp"])
                            )
                        )
            return memories
        except Exception as e:
            print(f"Error while searching & storing in memory: {str(e)}")
            return []

    def custom_search_with_filters(self, filter_: Filter, limit: int = 10):
        try:
            results = self.vector_store.vector_scroll(filter_=filter_, limit=limit) 
            memories: list[Memory] = []
            for point in results:
                point = cast(ScoredPoint, point)
                payload = point.payload or {}
                memories.append(
                        Memory(
                            id=str(point.id),
                            content=payload["content"],
                            memory_type=MemoryType(payload["memory_type"]),
                            metadata=payload.get("metadata", {}),
                            user_id=payload["user_id"],
                            timestamp=datetime.fromisoformat(payload["timestamp"]),
                            )
                        )
            return memories
        except Exception as e:
            print(f"Error while custom searching: {str(e)}")
            return []

