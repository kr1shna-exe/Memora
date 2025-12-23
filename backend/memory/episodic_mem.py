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

    def get_by_date_range(self, user_id: str, start: datetime, end: datetime):
        filter_ = Filter(must=[
            FieldCondition(key="user_id", match=MatchValue(value=user_id)),
            FieldCondition(key="timestamp", range=DatetimeRange(gte=start, lte=end))
            ])
        return self.memory_store.custom_search_with_filters(filter_)

    def search_with_recency_score(self, user_id: str, query: str, boost_factor: float = 0.1):
        results = self.memory_store.search_memories_with_scores(query=query, user_id=user_id)
        now = datetime.now()
        for result in results:
            age = (now - result.timestamp).days
            recency_factor = 1.0/ (1.0 + age * boost_factor)
            result.boosted_score = result.score * recency_factor
        results.sort(key=lambda x: x.boosted_score, reverse=True)
        return results[:10]
