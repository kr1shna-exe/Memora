from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from enum import Enum

class UserSchema(BaseModel):
    username: str = Field(min_length=3, max_length=10)
    email: EmailStr
    password: str = Field(min_length=4, max_length=10)


class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    password: str

class MemoryType(Enum):
    SEMANTIC = "semantic"
    EPISODIC = "episodic"
    PROCEDURAL = "procedural"

class Memory(BaseModel):
    id: str
    content: str
    memory_type: MemoryType
    metadata: dict
    user_id: int
    timestamp: datetime

class LLMProvider(Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    GROQ = "groq"

class OpenAIModel(Enum):
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"
    GPT_5 = "gpt-5"

class GeminiModel(Enum):
    FLASH = "gemini-2.0-flash"
    PRO = "gemini-2.0-pro"

class GroqModel(Enum):
    LLAMA_70B = "llama-3.3-70b-versatile"
    MIXTRAL = "mixtral-8x7b"
