from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    QDRANT_URL: str = ""
    OPENAI_API_KEY: SecretStr | None = None
    GROQ_API_KEY: SecretStr | None = None
    GEMINI_API_KEY: SecretStr | None = None
    DB_USERNAME: str = ""
    DB_PASS: str = ""
    DB_HOST: str = ""
    DB_PORT: int = 5454
    DB_NAME: str = ""
    JWT_SECRET: str = ""

settings = Settings()
