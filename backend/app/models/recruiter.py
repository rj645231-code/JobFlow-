from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey
from typing import List, Optional
from app.models.base import BaseModel
import uuid

class Recruiter(BaseModel):
    __tablename__ = "recruiters"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    company_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="recruiters")
    company: Mapped[Optional["Company"]] = relationship("Company", back_populates="recruiters")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="recruiter", cascade="all, delete")
