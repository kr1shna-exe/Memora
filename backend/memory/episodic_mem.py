from datetime import datetime, timedelta
from qdrant_client.models import Filter, FieldCondition, MatchValue, DatetimeRange
from storage.memory_store import MemoryStore


class EpisodicMemory:
    def __init__(self):
        self.memory_store = MemoryStore()

    def get_recent_memory(self, user_id: str, days: int = 7):
        cutoff = datetime.now() - timedelta(days=days)
        filter_ = Filter(must=[
            FieldCondition(key="user_id", match=MatchValue(value=user_id)),
            FieldCondition(key="timestamp", range=DatetimeRange(gte=cutoff))
            ])
        return self.memory_store.custom_search_with_filters(filter_)
