import os
from pathlib import Path
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
SESSIONS_DIR = DATA_DIR / "sessions"
DOCUMENTS_DIR = DATA_DIR / "documents"
AGENTS_DIR = Path(__file__).parent / "agents" / "definitions"


SCHEDULES_FILE = DATA_DIR / "schedules.json"


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    model: str = "claude-sonnet-4-6"
    computer_use_model: str = "claude-opus-4-5"
    max_tokens: int = 4096
    context_budget_tokens: int = 6000
    host: str = "0.0.0.0"
    port: int = int(os.environ.get("PORT", 8000))
    frontend_url: str = "http://localhost:3010"
    # Notion
    notion_api_key: str = ""
    notion_database_id: str = ""
    # Gmail
    gmail_user: str = ""
    gmail_app_password: str = ""
    gmail_to: str = ""  # 送信先（空の場合は gmail_user に送信）
    # Notifications
    notify_on_complete: bool = True

    class Config:
        env_file = BASE_DIR / ".env"
        env_file_encoding = "utf-8"


settings = Settings()


def ensure_dirs():
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    if not SCHEDULES_FILE.exists():
        SCHEDULES_FILE.write_text("[]", encoding="utf-8")
