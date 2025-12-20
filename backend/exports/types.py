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
