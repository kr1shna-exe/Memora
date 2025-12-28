import os
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config.settings import settings
from typing import List

if settings.GEMINI_API_KEY:
    os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY.get_secret_value()

class EmbeddingGenerator:
    def generate_embeddings(self, text: str) -> List[float]:
        gemini_embeddings = GoogleGenerativeAIEmbeddings(
                model="models/gemini-embedding-001",
                output_dimensionality=768,
                )
        vectors = gemini_embeddings.embed_query(text)
        # openai_embeddings = OpenAIEmbeddings(
        #         model="text-embedding-3-small",
        #         dimensions=1536,
        #         api_key=settings.OPENAI_API_KEY
        #         )
        # vectors = openai_embeddings.embed_query(text)
        return vectors
