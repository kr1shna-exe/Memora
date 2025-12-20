from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import settings
from config.settings import settings
from typing import List

def generate_embeddings(text: str) -> List[float]:
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
