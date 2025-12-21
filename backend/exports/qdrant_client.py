from qdrant_client import QdrantClient
from config.settings import settings

client = QdrantClient(settings.QDRANT_URL)
