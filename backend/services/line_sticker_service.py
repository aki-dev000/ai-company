"""
LINEスタンプ生成パイプライン。

初期版では、テーマに沿ったスタンプ構成・メタデータ・提出用ZIPを自動生成する。
画像は Pillow によるプレースホルダ生成で実装し、将来的に画像生成APIへ差し替える。
"""
from __future__ import annotations

import json
import random
import re
import textwrap
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from config import LINE_STICKERS_DIR

BASE_THEMES = [
    "MA° 静かな挨拶 — 軌道と余白のミニマルスタンプ",
    "MA° 日常のひとこと — テラコッタの温度感",
    "MA° やさしい返信 — 円弧で伝える気持ち",
    "MA° 仕事の合間に — モノトーンの敬語スタンプ",
    "MA° 夜の静けさ — 黒と生成りのおやすみ",
]

DEFAULT_PHRASES = [
    "ありがとう",
    "了解",
    "おつかれさま",
    "またね",
    "OK",
    "おはよう",
    "おやすみ",
    "よろしく",
]


def _slugify(value: str) -> str:
    slug = re.sub(r"[^\w\s\-]", "", value, flags=re.UNICODE)
    slug = re.sub(r"\s+", "-", slug.strip())
    return (slug[:48] or "line-sticker").lower()


def _safe_theme_title(theme: str) -> str:
    cleaned = theme.strip()
    return cleaned[:32] if cleaned else "LINEスタンプ"


def _build_sticker_phrases(theme: str, count: int) -> list[str]:
    theme_lower = theme.lower()
    if "敬語" in theme or "会社" in theme or "仕事" in theme or "office" in theme_lower:
        base = [
            "承知しました",
            "確認します",
            "ありがとうございます",
            "おつかれさまです",
            "少し遅れます",
            "問題ありません",
            "助かります",
            "よろしくお願いします",
        ]
    elif "夜" in theme or "おやすみ" in theme or "night" in theme_lower:
        base = [
            "おやすみ",
            "おつかれさま",
            "また明日",
            "ゆっくり休んで",
            "いい夢を",
            "ありがとう",
            "了解",
            "静かな夜を",
        ]
    else:
        base = DEFAULT_PHRASES

    if count <= len(base):
        return base[:count]
    return (base + DEFAULT_PHRASES)[:count]


# MA° brand palette: black, ivory, terracotta (orange-700)
def _pick_palette(theme: str) -> tuple[str, str]:
    seed = sum(ord(ch) for ch in theme)
    palettes = [
        ("#1c1917", "#c2410c"),   # stone-900 + orange-700 (terracotta)
        ("#292524", "#c2410c"),   # stone-800 + terracotta
        ("#1c1917", "#a16207"),   # stone-900 + amber accent
        ("#292524", "#78716c"),   # stone-800 + warm gray
        ("#fafaf9", "#1c1917"),   # ivory + black (light variant)
    ]
    return palettes[seed % len(palettes)]


def _font(size: int):
    try:
        return ImageFont.truetype("/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc", size)
    except Exception:
        return ImageFont.load_default()


def _draw_centered_text(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, font, fill: str):
    left, top, right, bottom = box
    wrapped = textwrap.fill(text, width=8)
    bbox = draw.multiline_textbbox((0, 0), wrapped, font=font, spacing=8, align="center")
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    x = left + (right - left - width) / 2
    y = top + (bottom - top - height) / 2
    draw.multiline_text((x, y), wrapped, font=font, fill=fill, spacing=8, align="center")


def _create_sticker_image(path: Path, phrase: str, theme: str, index: int, bg: str, accent: str):
    """MA° style: minimal orbit motif with clean typography."""
    image = Image.new("RGBA", (370, 320), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    # Background with rounded rect
    draw.rounded_rectangle((20, 20, 350, 300), radius=44, fill=bg)
    # Orbit arc (MA° signature motif)
    draw.arc((40, 30, 180, 170), start=200, end=350, fill=accent, width=4)
    # Small orbit dots
    draw.ellipse((164, 36, 178, 50), fill=accent)
    draw.ellipse((148, 54, 158, 64), fill=accent + "88" if len(accent) <= 7 else accent)
    # Centered phrase text
    text_color = "#fafaf9" if bg.startswith("#1") or bg.startswith("#2") else "#1c1917"
    _draw_centered_text(draw, (38, 100, 332, 250), phrase, _font(36), text_color)
    # MA° brand mark (bottom right, subtle)
    draw.text((280, 270), "MA°", font=_font(14), fill=text_color + "66")
    image.save(path)


def _create_main_image(path: Path, theme: str, bg: str, accent: str):
    """MA° main image with orbit mark."""
    image = Image.new("RGBA", (240, 240), bg)
    draw = ImageDraw.Draw(image)
    # Large orbit circle
    draw.arc((30, 20, 190, 180), start=200, end=350, fill=accent, width=5)
    draw.ellipse((174, 26, 192, 44), fill=accent)
    # MA text
    text_color = "#fafaf9" if bg.startswith("#1") or bg.startswith("#2") else "#1c1917"
    _draw_centered_text(draw, (20, 100, 220, 200), "MA°", _font(48), text_color)
    image.save(path)


def _create_tab_image(path: Path, bg: str, accent: str):
    """MA° tab image with small orbit motif."""
    image = Image.new("RGBA", (96, 74), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((4, 6, 92, 68), radius=18, fill=bg)
    draw.arc((14, 10, 58, 54), start=200, end=350, fill=accent, width=3)
    draw.ellipse((52, 12, 62, 22), fill=accent)
    text_color = "#fafaf9" if bg.startswith("#1") or bg.startswith("#2") else "#1c1917"
    draw.text((30, 36), "MA°", font=_font(14), fill=text_color)
    image.save(path)


def _create_preview_sheet(path: Path, sticker_dir: Path, phrases: list[str]):
    sheet = Image.new("RGBA", (860, 980), "#1c1917")
    draw = ImageDraw.Draw(sheet)
    draw.text((36, 28), "MA° LINE Sticker Preview", font=_font(36), fill="#fafaf9")
    draw.text((36, 76), "minimal orbit / measured heat", font=_font(18), fill="#78716c")
    for index, phrase in enumerate(phrases, start=1):
        sticker = Image.open(sticker_dir / f"{index:02d}.png")
        x = 36 + ((index - 1) % 2) * 392
        y = 128 + ((index - 1) // 2) * 204
        thumb = sticker.resize((370, 320))
        sheet.alpha_composite(thumb, (x, y))
        draw.text((x, y + 328), f"{index:02d}. {phrase}", font=_font(18), fill="#a8a29e")
    sheet.save(path)


def _write_json(path: Path, payload: dict[str, Any]):
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _zip_set(output_dir: Path, zip_path: Path):
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(output_dir.iterdir()):
            if file.name == zip_path.name or file.is_dir():
                continue
            archive.write(file, arcname=file.name)


def _list_sets_raw() -> list[dict[str, Any]]:
    LINE_STICKERS_DIR.mkdir(parents=True, exist_ok=True)
    results: list[dict[str, Any]] = []
    for directory in sorted(LINE_STICKERS_DIR.iterdir(), reverse=True):
        if not directory.is_dir():
            continue
        metadata_path = directory / "metadata.json"
        if not metadata_path.exists():
            continue
        try:
            data = json.loads(metadata_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        zip_name = data.get("zip_file") or ""
        zip_path = directory / zip_name if zip_name else None
        results.append(
            {
                "id": data.get("id", directory.name),
                "title": data.get("title", directory.name),
                "theme": data.get("theme", ""),
                "description": data.get("description", ""),
                "status": data.get("status", "completed"),
                "count": data.get("count", 0),
                "created_at": data.get("created_at", ""),
                "review_flags": data.get("review_flags", []),
                "has_preview": (directory / "preview-sheet.png").exists(),
                "has_zip": bool(zip_path and zip_path.exists()),
                "size": zip_path.stat().st_size if zip_path and zip_path.exists() else 0,
            }
        )
    return results


def list_line_sticker_sets() -> list[dict[str, Any]]:
    return _list_sets_raw()


def get_line_sticker_set(set_id: str) -> dict[str, Any] | None:
    metadata_path = LINE_STICKERS_DIR / set_id / "metadata.json"
    if not metadata_path.exists():
        return None
    return json.loads(metadata_path.read_text(encoding="utf-8"))


def create_weekly_theme() -> str:
    week_index = datetime.now().isocalendar().week % len(BASE_THEMES)
    return BASE_THEMES[week_index]


def generate_line_sticker_set(
    theme: str,
    audience: str = "",
    style_prompt: str = "",
    tone: str = "",
    negative_prompt: str = "",
    count: int = 8,
) -> dict[str, Any]:
    LINE_STICKERS_DIR.mkdir(parents=True, exist_ok=True)

    if count != 8:
        raise ValueError("initial release supports only 8 stickers")

    theme = theme.strip()
    if not theme:
        raise ValueError("theme is required")

    date_str = datetime.now().strftime("%Y-%m-%d")
    slug = _slugify(theme)
    base_id = f"line-sticker-{slug}-{date_str}"
    output_dir = LINE_STICKERS_DIR / base_id
    suffix = 1
    while output_dir.exists():
        output_dir = LINE_STICKERS_DIR / f"{base_id}-{suffix}"
        suffix += 1
    output_dir.mkdir(parents=True, exist_ok=True)

    bg, accent = _pick_palette(theme)
    phrases = _build_sticker_phrases(theme, count)
    review_flags: list[str] = []
    if any(token in negative_prompt for token in ["ブランド", "ロゴ", "既存キャラ"]):
        review_flags.append("権利侵害回避のため、プロンプトに禁止要素を反映してください")
    if "政治" in theme or "選挙" in theme:
        review_flags.append("政治表現は審査リスクが高いため再検討が必要です")

    stickers = []
    for index, phrase in enumerate(phrases, start=1):
        filename = f"{index:02d}.png"
        _create_sticker_image(output_dir / filename, phrase, theme, index, bg, accent)
        stickers.append(
            {
                "index": index,
                "text": phrase,
                "emotion": random.choice(["happy", "calm", "thanks", "apology", "support"]),
                "usage": "daily-conversation",
                "file": filename,
            }
        )

    _create_main_image(output_dir / "main.png", theme, bg, accent)
    _create_tab_image(output_dir / "tab.png", bg, accent)
    _create_preview_sheet(output_dir / "preview-sheet.png", output_dir, phrases)

    manifest = {
        "format": "line-sticker-set",
        "version": 1,
        "generated_at": datetime.now().isoformat(),
        "files": [f"{i:02d}.png" for i in range(1, count + 1)] + ["main.png", "tab.png", "preview-sheet.png", "metadata.json"],
    }
    _write_json(output_dir / "manifest.json", manifest)

    metadata = {
        "id": output_dir.name,
        "theme": theme,
        "title": f"MA° {_safe_theme_title(theme)}",
        "description": f"{theme} をテーマにした MA° Design & Goods の自動生成スタンプセット",
        "status": "completed",
        "count": count,
        "created_at": datetime.now().isoformat(),
        "audience": audience,
        "style_prompt": style_prompt,
        "tone": tone,
        "negative_prompt": negative_prompt,
        "review_flags": review_flags,
        "stickers": stickers,
        "zip_file": f"{output_dir.name}.zip",
    }
    _write_json(output_dir / "metadata.json", metadata)

    zip_path = output_dir / metadata["zip_file"]
    _zip_set(output_dir, zip_path)

    return {
        "id": output_dir.name,
        "title": metadata["title"],
        "theme": theme,
        "count": count,
        "created_at": metadata["created_at"],
        "zip_file": metadata["zip_file"],
        "preview_file": "preview-sheet.png",
        "review_flags": review_flags,
    }


async def run_weekly_line_sticker_job() -> dict[str, Any]:
    theme = create_weekly_theme()
    return generate_line_sticker_set(
        theme=theme,
        audience="MA° brand audience",
        style_prompt="ミニマル、軌道・円弧モチーフ、黒・生成り・テラコッタ、余白を活かした静かなデザイン",
        tone="minimal-calm",
        negative_prompt="既存キャラ風、派手な色使い、政治、暴力、性的表現",
        count=8,
    )
