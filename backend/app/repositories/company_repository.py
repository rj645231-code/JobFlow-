from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Tuple
from app.models.company import Company
from app.repositories.base_repository import BaseRepository
from app.schemas.company import CompanyCreate, CompanyUpdate
import uuid

class CompanyRepository(BaseRepository[Company, CompanyCreate, CompanyUpdate]):
    def __init__(self):
        super().__init__(Company)

    async def search(self, db: AsyncSession, user_id: uuid.UUID, search_query: str = "", skip: int = 0, limit: int = 100) -> Tuple[List[Company], int]:
        query = select(Company).where(Company.user_id == user_id)
        if search_query:
            query = query.where(Company.name.ilike(f"%{search_query}%"))
        
        total = await db.execute(select(func.count()).select_from(query.subquery()))
        total_count = total.scalar_one()

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        
        return list(result.scalars().all()), total_count

company_repository = CompanyRepository()
