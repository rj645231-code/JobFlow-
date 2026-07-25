from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.repositories.user_repository import user_repository
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import UnauthorizedError, DuplicateError
from datetime import timedelta
from app.config import settings
from app.models.user import User

class AuthService:
    async def register(self, db: AsyncSession, data: RegisterRequest) -> TokenResponse:
        """Register a new user."""
        existing_user = await user_repository.get_by_email(db, data.email)
        if existing_user:
            raise DuplicateError("Email already registered")
        
        hashed = hash_password(data.password)
        
        user_data = {
            "name": data.name,
            "email": data.email,
            "hashed_password": hashed
        }
        
        db_user = User(**user_data)
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        
        return self._generate_tokens(db_user)

    async def login(self, db: AsyncSession, data: LoginRequest) -> TokenResponse:
        """Authenticate user and return tokens."""
        user = await user_repository.get_by_email(db, data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedError("Invalid email or password")
        
        return self._generate_tokens(user)

    async def refresh_token(self, db: AsyncSession, refresh_token: str) -> TokenResponse:
        """Refresh access token."""
        payload = decode_token(refresh_token)
        email = payload.get("sub")
        if not email:
            raise UnauthorizedError("Invalid refresh token")
        
        user = await user_repository.get_by_email(db, email)
        if not user:
            raise UnauthorizedError("User not found")
            
        return self._generate_tokens(user)
        
    def _generate_tokens(self, user: User) -> TokenResponse:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(data={"sub": user.email})
        
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

auth_service = AuthService()
