from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from config import DOCUMENTS_DIR

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("/{session_id}")
async def list_documents(session_id: str):
    doc_dir = DOCUMENTS_DIR / session_id
    if not doc_dir.exists():
        return []
    files = sorted(doc_dir.glob("*.md"))
    return [
        {"filename": f.name, "size": f.stat().st_size}
        for f in files
    ]


@router.get("/{session_id}/{filename}")
async def get_document(session_id: str, filename: str):
    # Prevent path traversal
    if ".." in filename or "/" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    doc_path = DOCUMENTS_DIR / session_id / filename
    if not doc_path.exists():
        raise HTTPException(status_code=404, detail="Document not found")
    return PlainTextResponse(doc_path.read_text(encoding="utf-8"))
