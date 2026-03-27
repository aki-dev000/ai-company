def fetch_url(url: str, max_chars: int = 3000) -> str:
    """
    指定URLのページ本文テキストを取得・整形して返す。
    """
    try:
        import httpx
        from bs4 import BeautifulSoup

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }
        with httpx.Client(timeout=15, follow_redirects=True) as client:
            response = client.get(url, headers=headers)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # 不要タグを除去
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
            tag.decompose()

        # メインコンテンツを優先取得
        main = soup.find("main") or soup.find("article") or soup.find("body")
        text = main.get_text(separator="\n", strip=True) if main else soup.get_text(separator="\n", strip=True)

        # 連続空行を圧縮
        lines = [l for l in text.splitlines() if l.strip()]
        compressed = "\n".join(lines)

        return compressed[:max_chars] + ("..." if len(compressed) > max_chars else "")

    except Exception as e:
        return f"URLの取得に失敗しました: {e}"


def execute(tool_input: dict) -> str:
    url = tool_input["url"]
    max_chars = tool_input.get("max_chars", 3000)
    return fetch_url(url, max_chars)
