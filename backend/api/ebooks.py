"""
電子書籍（EPUB）の一覧取得・ダウンロード・生成APIエンドポイント。
"""
import asyncio
import re
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, BackgroundTasks, Header
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, SecretStr
import httpx

from config import DATA_DIR, settings
from services.note_draft_service import extract_markdown_title, publish_note_draft

EBOOKS_DIR = DATA_DIR / "ebooks"

router = APIRouter()


def _list_epub_files() -> list[dict]:
    """EPUB ファイルの一覧を返す（新しい順）。"""
    EBOOKS_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(EBOOKS_DIR.glob("*.epub"), key=lambda p: p.stat().st_mtime, reverse=True)
    result = []
    for f in files:
        md_path = f.with_suffix(".md")
        result.append({
            "filename": f.name,
            "date": f.stem.split("-")[-3] + "-" + f.stem.split("-")[-2] + "-" + f.stem.split("-")[-1]
            if len(f.stem.split("-")) >= 3 else "",
            "size": f.stat().st_size,
            "has_markdown": md_path.exists(),
        })
    return result


def _parse_date(filename: str) -> str:
    """ファイル名から日付部分を抽出する（YYYY-MM-DD）。"""
    # ebook-slug-YYYY-MM-DD.epub 形式
    parts = Path(filename).stem.split("-")
    for i in range(len(parts) - 2):
        if len(parts[i]) == 4 and parts[i].isdigit():
            return f"{parts[i]}-{parts[i+1]}-{parts[i+2]}"
    return ""


@router.get("/api/ebooks")
async def list_ebooks():
    """生成済み電子書籍の一覧を返す（EPUB + PDF-only の両方を含む）。"""
    EBOOKS_DIR.mkdir(parents=True, exist_ok=True)

    seen_stems: set[str] = set()
    result = []

    # EPUB ファイル
    for f in sorted(EBOOKS_DIR.glob("*.epub"), key=lambda p: p.stat().st_mtime, reverse=True):
        seen_stems.add(f.stem)
        md_path = f.with_suffix(".md")
        title = ""
        if md_path.exists():
            text = md_path.read_text(encoding="utf-8")
            m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
            if m:
                title = m.group(1).strip()
        result.append({
            "filename": f.name,
            "date": _parse_date(f.name),
            "size": f.stat().st_size,
            "has_markdown": md_path.exists(),
            "has_pdf": f.with_suffix(".pdf").exists(),
            "has_note": f.with_suffix(".note.md").exists(),
            "title": title,
        })

    # PDF-only ファイル（対応するEPUBが無いもの）
    for f in sorted(EBOOKS_DIR.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True):
        if f.stem in seen_stems:
            continue
        seen_stems.add(f.stem)
        md_path = f.with_suffix(".md")
        title = ""
        if md_path.exists():
            text = md_path.read_text(encoding="utf-8")
            m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
            if m:
                title = m.group(1).strip()
        result.append({
            "filename": f.name,
            "date": _parse_date(f.name),
            "size": f.stat().st_size,
            "has_markdown": md_path.exists(),
            "has_pdf": True,
            "has_note": f.with_suffix(".note.md").exists(),
            "title": title,
        })

    return result


@router.get("/api/ebooks/{filename}/markdown")
async def get_ebook_markdown(filename: str):
    """Markdownプレビューを返す。"""
    if ".." in filename or "/" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    md_path = EBOOKS_DIR / filename.replace(".epub", ".md")
    if not md_path.exists():
        raise HTTPException(status_code=404, detail="Markdown not found")
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(md_path.read_text(encoding="utf-8"))


@router.get("/api/ebooks/{filename}/note")
async def get_ebook_note_markdown(filename: str):
    """note向け抜粋Markdownを返す。"""
    if ".." in filename or "/" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    note_path = EBOOKS_DIR / filename.replace(".epub", ".note.md")
    if not note_path.exists():
        raise HTTPException(status_code=404, detail="Note markdown not found")
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(note_path.read_text(encoding="utf-8"))


@router.get("/api/ebooks/{filename}")
async def download_ebook(filename: str):
    """EPUBファイルをダウンロードする。"""
    if ".." in filename or "/" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    epub_path = EBOOKS_DIR / filename
    if not epub_path.exists():
        raise HTTPException(status_code=404, detail="E-book not found")
    return FileResponse(
        path=str(epub_path),
        media_type="application/epub+zip",
        filename=filename,
    )


@router.get("/api/ebooks/{filename}/pdf")
async def download_ebook_pdf(filename: str):
    """PDFファイルをダウンロードする。"""
    if ".." in filename or "/" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    # .epub → .pdf に変換するパターンと、直接 .pdf を指定するパターン両方に対応
    pdf_path = EBOOKS_DIR / filename.replace(".epub", ".pdf")
    if not pdf_path.exists():
        pdf_path = EBOOKS_DIR / filename
    if not pdf_path.exists() or not pdf_path.suffix == ".pdf":
        raise HTTPException(status_code=404, detail="PDF not found")
    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=pdf_path.name,
    )


class EbookRequest(BaseModel):
    theme: str
    author: str = "Neiro Research Division"
    description: str = ""
    subject: str = ""
    generate_note: bool = True


class PaidNoteDraftRequest(BaseModel):
    theme: str
    author: str = "Neiro Research Division"
    description: str = ""
    subject: str = ""
    price: int = 500
    note_email: Optional[EmailStr] = None
    note_password: Optional[SecretStr] = None
    headless: bool = True


_running_jobs: set[str] = set()


@router.post("/api/ebooks/run-now")
async def run_ebook_now(req: EbookRequest, background_tasks: BackgroundTasks):
    """指定テーマで電子書籍を即時生成する（バックグラウンド実行）。"""
    if not req.theme.strip():
        raise HTTPException(status_code=422, detail="theme is required")

    theme = req.theme.strip()
    if theme in _running_jobs:
        return {"status": "already_running", "message": f"「{theme}」の生成はすでに実行中です。"}

    async def _run():
        _running_jobs.add(theme)
        try:
            from services.ebook_service import generate_ebook
            await generate_ebook(
                theme,
                author=req.author.strip() or "Neiro Research Division",
                description=req.description.strip(),
                subject=req.subject.strip(),
                generate_note=req.generate_note,
            )
        except Exception as e:
            print(f"[EBook] run-now failed: {e}")
        finally:
            _running_jobs.discard(theme)

    background_tasks.add_task(_run)
    return {
        "status": "started",
        "message": f"「{theme}」の電子書籍生成を開始しました。生成完了まで5〜10分かかります。",
        "theme": theme,
    }


@router.post("/api/ebooks/generate-note-draft")
async def generate_paid_note_draft(
    req: PaidNoteDraftRequest,
    x_api_key: Optional[str] = Header(default=None),
):
    """記事生成後にローカルの Note下書きフォルダへ下書きテキストを保存する。"""
    from services.ebook_service import generate_ebook

    if settings.automation_api_key and x_api_key != settings.automation_api_key:
        raise HTTPException(status_code=401, detail="invalid api key")

    theme = req.theme.strip()
    if not theme:
        raise HTTPException(status_code=422, detail="theme is required")

    result = await generate_ebook(
        theme,
        author=req.author.strip() or "Neiro Research Division",
        description=req.description.strip(),
        subject=req.subject.strip(),
        generate_note=True,
    )

    note_path = EBOOKS_DIR / result["filename"].replace(".epub", ".note.md")
    if not note_path.exists():
        raise HTTPException(status_code=500, detail="generated note markdown not found")

    note_markdown = note_path.read_text(encoding="utf-8")
    note_title = extract_markdown_title(note_markdown, result["title"])

    try:
        publish_result = await publish_note_draft(
            title=note_title,
            body=note_markdown,
            price=req.price,
            note_email=str(req.note_email or ""),
            note_password=req.note_password.get_secret_value() if req.note_password else "",
            headless=req.headless,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {
        "status": "completed",
        "theme": theme,
        "ebook": result,
        "note_title": note_title,
        "note_price": req.price,
        "note_publish_result": publish_result,
    }
