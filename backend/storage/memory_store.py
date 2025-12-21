from exports.types import Memory
from utils.embeddings import EmbeddingGenerator
from vector_store import VectorStore

class MemoryStore:
    def __init__(self, collection_name: str = "memories"):
        self.vector = VectorStore()
        self.embed = EmbeddingGenerator()

    def store_memory(self, memory: Memory):
        embed_content = self.embed.generate_embeddings(memory.content)
