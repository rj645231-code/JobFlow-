from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey
from typing import List, Optional
from app.models.base import BaseModel
import uuid

class Company(BaseModel):
    __tablename__ = "companies"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String)
    website: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="companies")
    recruiters: Mapped[List["Recruiter"]] = relationship("Recruiter", back_populates="company", cascade="all, delete")
    jobs: Mapped[List["Job"]] = relationship("Job", back_populates="company", cascade="all, delete")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="company", cascade="all, delete")
