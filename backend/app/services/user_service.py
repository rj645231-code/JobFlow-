from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import user_repository
from app.schemas.user import UserUpdate
from app.models.user import User

class UserService:
    async def get_profile(self, db: AsyncSession, user_id: str) -> User:
        """Get user profile."""
        return await user_repository.get(db, id=user_id)

    async def update_profile(self, db: AsyncSession, user: User, data: UserUpdate) -> User:
        """Update user profile."""
        return await user_repository.update(db, db_obj=user, obj_in=data)

    async def update_smtp(self, db: AsyncSession, user: User, host: str, port: int, username: str, password: str) -> User:
        """Update SMTP credentials."""
        user.smtp_host = host
        user.smtp_port = port
        user.smtp_username = username
        user.smtp_password = password
        user.email_provider = "smtp"
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

user_service = UserService()
