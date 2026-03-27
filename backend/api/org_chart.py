from fastapi import APIRouter
from agents.registry import get_org_chart

router = APIRouter(prefix="/api/org-chart", tags=["org-chart"])


@router.get("")
async def org_chart():
    return get_org_chart()
