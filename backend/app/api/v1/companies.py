from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse, CompanyListResponse
from app.models.user import User
from app.dependencies import get_current_user
from app.repositories.company_repository import company_repository
from app.core.exceptions import NotFoundError
import uuid

router = APIRouter()

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    data: CompanyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Need to merge user_id into data
    company_data = data.model_dump()
    company_data["user_id"] = current_user.id
    return await company_repository.create(db, obj_in=company_data)

@router.get("", response_model=CompanyListResponse)
async def list_companies(
    search: str = "",
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = await company_repository.search(db, current_user.id, search, skip, size)
    return {"items": items, "total": total, "page": page, "size": size}

@router.get("/{id}", response_model=CompanyResponse)
async def get_company(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    company = await company_repository.get(db, id)
    if not company or company.user_id != current_user.id:
        raise NotFoundError("Company not found")
    return company

@router.patch("/{id}", response_model=CompanyResponse)
async def update_company(
    id: uuid.UUID,
    data: CompanyUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    company = await company_repository.get(db, id)
    if not company or company.user_id != current_user.id:
        raise NotFoundError("Company not found")
    return await company_repository.update(db, db_obj=company, obj_in=data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    company = await company_repository.get(db, id)
    if not company or company.user_id != current_user.id:
        raise NotFoundError("Company not found")
    await company_repository.delete(db, id=id)
