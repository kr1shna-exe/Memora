from datetime import datetime
import uuid
from exports.qdrant_client import client
from qdrant_client.models import Distance, FieldCondition, Filter, VectorParams, PointStruct, MatchValue

from exports.types import MemoryType

class VectorStore:
    def __init__(self, collection_name: str = "memories", vector_size: int = 768):
        self.client = client
        self.collection_name = collection_name
        self.vector_size = vector_size

    def _create_collection(self):
        if self.client.collection_exists(self.collection_name):
            return 
        try:
            self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE)
                    )
        except Exception as e:
            print(f"Error while creating the collection: {str(e)}")

    def _add_vector(self, embedding, user_id: str, content: str):
        point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "userid": user_id,
                    "memory_type": MemoryType.value,
                    "content": content,
                    "timestamp": datetime.now().isoformat()
                    }
                )
        self.client.upsert(self.collection_name, points=[point])

    def _search(self, query:str, user_id: str):
        return self.client.query(
                collection_name=self.collection_name,
                query_text=query,
                query_filter=Filter(must=[FieldCondition(key="userid", match=MatchValue(value=user_id))]),
                with_payload=True,
                limit=5
                )
