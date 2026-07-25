from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Tuple
from app.models.recruiter import Recruiter
from app.repositories.base_repository import BaseRepository
from app.schemas.recruiter import RecruiterCreate, RecruiterUpdate
import uuid

class RecruiterRepository(BaseRepository[Recruiter, RecruiterCreate, RecruiterUpdate]):
    def __init__(self):
        super().__init__(Recruiter)

    async def search(self, db: AsyncSession, user_id: uuid.UUID, search_query: str = "", skip: int = 0, limit: int = 100) -> Tuple[List[Recruiter], int]:
        query = select(Recruiter).where(Recruiter.user_id == user_id)
        if search_query:
            query = query.where(Recruiter.name.ilike(f"%{search_query}%") | Recruiter.email.ilike(f"%{search_query}%"))
        
        total = await db.execute(select(func.count()).select_from(query.subquery()))
        total_count = total.scalar_one()

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        
        return list(result.scalars().all()), total_count

    async def bulk_create(self, db: AsyncSession, recruiters: List[Recruiter]) -> None:
        db.add_all(recruiters)
        await db.commit()

recruiter_repository = RecruiterRepository()
