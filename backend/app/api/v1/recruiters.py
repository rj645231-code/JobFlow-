from fastapi import APIRouter, Depends, Query, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.recruiter import RecruiterCreate, RecruiterUpdate, RecruiterResponse, RecruiterListResponse, CSVImportResponse
from app.models.user import User
from app.dependencies import get_current_user
from app.repositories.recruiter_repository import recruiter_repository
from app.services.csv_import_service import csv_import_service
from app.core.exceptions import NotFoundError
import uuid
from app.models.recruiter import Recruiter

router = APIRouter()

@router.post("", response_model=RecruiterResponse, status_code=status.HTTP_201_CREATED)
async def create_recruiter(
    data: RecruiterCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    recruiter_data = data.model_dump()
    recruiter_data["user_id"] = current_user.id
    return await recruiter_repository.create(db, obj_in=recruiter_data)

@router.get("", response_model=RecruiterListResponse)
async def list_recruiters(
    search: str = "",
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    skip = (page - 1) * size
    items, total = await recruiter_repository.search(db, current_user.id, search, skip, size)
    return {"items": items, "total": total, "page": page, "size": size}

@router.get("/{id}", response_model=RecruiterResponse)
async def get_recruiter(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    recruiter = await recruiter_repository.get(db, id)
    if not recruiter or recruiter.user_id != current_user.id:
        raise NotFoundError("Recruiter not found")
    return recruiter

@router.patch("/{id}", response_model=RecruiterResponse)
async def update_recruiter(
    id: uuid.UUID,
    data: RecruiterUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    recruiter = await recruiter_repository.get(db, id)
    if not recruiter or recruiter.user_id != current_user.id:
        raise NotFoundError("Recruiter not found")
    return await recruiter_repository.update(db, db_obj=recruiter, obj_in=data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recruiter(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    recruiter = await recruiter_repository.get(db, id)
    if not recruiter or recruiter.user_id != current_user.id:
        raise NotFoundError("Recruiter not found")
    await recruiter_repository.delete(db, id=id)

@router.post("/import/csv", response_model=CSVImportResponse)
async def import_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    content = await file.read()
    schemas = csv_import_service.parse_recruiter_csv(content)
    
    recruiters = [
        Recruiter(**s.model_dump(), user_id=current_user.id)
        for s in schemas
    ]
    await recruiter_repository.bulk_create(db, recruiters)
    
    return CSVImportResponse(imported_count=len(recruiters), errors=[])

@router.get("/import/template")
async def get_csv_template():
    # Return CSV string for users to download
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(
        content="name,email,phone,linkedin_url,notes\nJohn Doe,john@example.com,,,", 
        media_type="text/csv"
    )
