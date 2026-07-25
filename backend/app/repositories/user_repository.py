from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.models.user import User
from app.repositories.base_repository import BaseRepository
from app.schemas.auth import RegisterRequest
from app.schemas.user import UserUpdate

class UserRepository(BaseRepository[User, RegisterRequest, UserUpdate]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def update_gmail_token(self, db: AsyncSession, user: User, token: str, refresh_token: str) -> User:
        user.gmail_token = token
        user.gmail_refresh_token = refresh_token
        user.email_provider = "gmail"
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

user_repository = UserRepository()
