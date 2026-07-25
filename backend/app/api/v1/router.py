from fastapi import APIRouter
from app.api.v1 import auth, users, companies, recruiters

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(recruiters.router, prefix="/recruiters", tags=["recruiters"])
