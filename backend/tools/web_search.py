import json
from typing import Any


def search_web(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    """
    DuckDuckGoでウェブ検索を行い、結果リストを返す。
    Returns: [{"title": str, "href": str, "body": str}, ...]
    """
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        return results
    except Exception as e:
        return [{"title": "検索エラー", "href": "", "body": str(e)}]


def format_search_results(results: list[dict[str, Any]]) -> str:
    """検索結果をClaudeに渡すテキスト形式に整形する。"""
    if not results:
        return "検索結果が見つかりませんでした。"

    lines = []
    for i, r in enumerate(results, 1):
        lines.append(f"## 結果 {i}: {r.get('title', '(タイトルなし)')}")
        lines.append(f"URL: {r.get('href', '')}")
        lines.append(r.get('body', ''))
        lines.append("")
    return "\n".join(lines)


def execute(tool_input: dict) -> str:
    query = tool_input["query"]
    max_results = tool_input.get("max_results", 5)
    results = search_web(query, max_results)
    return format_search_results(results)
