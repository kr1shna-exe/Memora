from pydantic import BaseModel, Field, Emailstr

class UserSchema(BaseModel):
    username: str = Field(min_length=3, max_length=10)
    email: Emailstr
    password: str = Field(min_length=4, max_length=10)
