from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ensure_dirs, settings
from agents.registry import load_agents
from api.directives import router as directives_router
from api.stream import router as stream_router
from api.documents import router as documents_router
from api.org_chart import router as org_chart_router
from api.dispatch import router as dispatch_router
from scheduler import init_scheduler, scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_dirs()
    load_agents()
    init_scheduler()
    print(f"TechForward Inc. AI Company started. Model: {settings.model}")
    yield
    scheduler.shutdown(wait=False)


app = FastAPI(title="TechForward Inc. - AI Company API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3010",
        "http://127.0.0.1:3010",
        settings.frontend_url,
        "https://frontend-iota-eight-68.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(directives_router)
app.include_router(stream_router)
app.include_router(documents_router)
app.include_router(org_chart_router)
app.include_router(dispatch_router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "company": "TechForward Inc."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
