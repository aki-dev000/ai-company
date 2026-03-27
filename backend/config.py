import os
from pathlib import Path
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
SESSIONS_DIR = DATA_DIR / "sessions"
DOCUMENTS_DIR = DATA_DIR / "documents"
AGENTS_DIR = Path(__file__).parent / "agents" / "definitions"


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    model: str = "claude-sonnet-4-6"
    max_tokens: int = 4096
    context_budget_tokens: int = 6000
    host: str = "0.0.0.0"
    port: int = int(os.environ.get("PORT", 8000))
    frontend_url: str = "http://localhost:3010"

    class Config:
        env_file = BASE_DIR / ".env"
        env_file_encoding = "utf-8"


settings = Settings()


def ensure_dirs():
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
