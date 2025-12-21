from exports.qdrant_client import client
from qdrant_client.models import Distance, FieldCondition, Filter, VectorParams, MatchValue, PointStruct

class VectorStore:
    def __init__(self, collection_name: str = "memories", vector_size: int = 768):
        self.client = client
        self.collection_name = collection_name
        self.vector_size = vector_size
        self._create_collection()

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

    def add_vector(self, point_id: str, vector: list[float], payload: dict):
        self.client.upsert(collection_name=self.collection_name, wait=True, points=[
            PointStruct(id=point_id, vector=vector, payload=payload)
            ])

    def search(self, vector: list[float], filter_: Filter, limit: int = 5):
        return self.client.query_points(
                collection_name=self.collection_name,
                vector=vector,
                filter=filter_,
                with_payload=True,
                limit=limit
                )

    def delete(self, point_id: str):
        self.client.delete(
                collection_name=self.collection_name,
                points_selector=[point_id]
                )
