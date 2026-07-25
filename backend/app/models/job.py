from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Enum
from typing import List, Optional
from app.models.base import BaseModel
import uuid
import enum

class EmploymentType(str, enum.Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    internship = "internship"
    freelance = "freelance"

class Job(BaseModel):
    __tablename__ = "jobs"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"))
    
    position: Mapped[str] = mapped_column(String)
    job_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    salary_range: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    employment_type: Mapped[Optional[EmploymentType]] = mapped_column(Enum(EmploymentType), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="jobs")
    company: Mapped["Company"] = relationship("Company", back_populates="jobs")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="job", cascade="all, delete")
