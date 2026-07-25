from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedError
from app.models.user import User
from app.repositories.user_repository import user_repository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = decode_token(token)
        email = payload.get("sub")
        if email is None:
            raise UnauthorizedError("Invalid authentication credentials")
    except Exception:
        raise UnauthorizedError("Invalid authentication credentials")
        
    user = await user_repository.get_by_email(db, email=email)
    if user is None:
        raise UnauthorizedError("User not found")
        
    return user
