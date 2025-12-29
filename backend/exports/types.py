from datetime import datetime
from typing import List, Dict
from pydantic import BaseModel, Field, EmailStr
from enum import Enum

class ConversationRequest(BaseModel):
    user_id: str
    messages: List[Dict[str, str]]

class SearchRequest(BaseModel):
    user_id: str
    query: str

class RegisterSchema(BaseModel):
    username: str = Field(min_length=3, max_length=10)
    email: EmailStr
    password: str = Field(min_length=4, max_length=10)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4, max_length=10)

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    password: str

class MessageSchema(BaseModel):
    role: str
    content: str

class ConversationCreate(BaseModel):
    title: str

class MessageCreate(BaseModel):
    content: str

class MemoryExtractionOutput(BaseModel):
    """Output format from LLM memory extraction"""
    facts: List[str] = Field(default_factory=list)
    class Config:
        extra = "ignore"

class MemoryExtractionItem(BaseModel):
    """Individual memory item with type classification"""
    content: str
    type: str

class MemoryExtractionWithTypes(BaseModel):
    """Extraction output with memory type classification"""
    memories: List[MemoryExtractionItem] = Field(default_factory=list)
    class Config:
        extra = "ignore"

class MemoryType(Enum):
    SEMANTIC = "semantic"
    EPISODIC = "episodic"

class Memory(BaseModel):
    id: str
    content: str
    memory_type: MemoryType
    metadata: dict
    user_id: str
    timestamp: datetime

class MemorySearchResult(Memory):
    score: float
    boosted_score: float = 0.0

class LLMProvider(Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    GROQ = "groq"

class OpenAIModel(Enum):
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"
    GPT_5 = "gpt-5"

class GeminiModel(Enum):
    FLASH = "gemini-2.5-flash"
    PRO = "gemini-2.5-pro"

class GroqModel(Enum):
    LLAMA_70B = "llama-3.3-70b-versatile"
    MIXTRAL = "mixtral-8x7b"
