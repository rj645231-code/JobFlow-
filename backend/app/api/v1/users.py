from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import User
from app.dependencies import get_current_user
from app.services.user_service import user_service
from pydantic import BaseModel

router = APIRouter()

class SMTPUpdate(BaseModel):
    host: str
    port: int
    username: str
    password: str

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await user_service.update_profile(db, current_user, data)

@router.patch("/me/smtp", response_model=UserResponse)
async def update_smtp(
    data: SMTPUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await user_service.update_smtp(
        db, current_user, data.host, data.port, data.username, data.password
    )
