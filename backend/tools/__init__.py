from tools.web_search import search_web
from tools.url_fetch import fetch_url

__all__ = ["search_web", "fetch_url"]

# Claude tool definitions for tool_use API
TOOL_DEFINITIONS = [
    {
        "name": "web_search",
        "description": (
            "DuckDuckGoを使ってウェブ検索を行います。"
            "リアルタイムの情報、競合他社の情報、最新ニュース、市場データを取得するために使用してください。"
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "検索クエリ（日本語・英語どちらでも可）"
                },
                "max_results": {
                    "type": "integer",
                    "description": "取得する結果の最大件数（デフォルト: 5）",
                    "default": 5
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "fetch_url",
        "description": (
            "指定したURLのページ本文テキストを取得します。"
            "検索結果のURLを詳しく読み込む際や、特定のページの内容を確認する際に使用してください。"
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "取得するページのURL"
                },
                "max_chars": {
                    "type": "integer",
                    "description": "取得する文字数の上限（デフォルト: 3000）",
                    "default": 3000
                }
            },
            "required": ["url"]
        }
    }
]
