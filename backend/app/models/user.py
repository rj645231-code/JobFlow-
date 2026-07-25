from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Enum
from typing import List, Optional
from app.models.base import BaseModel
import enum

class EmailProvider(str, enum.Enum):
    gmail = "gmail"
    smtp = "smtp"

class User(BaseModel):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    
    gmail_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    gmail_refresh_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    smtp_host: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    smtp_port: Mapped[Optional[int]] = mapped_column(nullable=True)
    smtp_username: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    smtp_password: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    email_provider: Mapped[EmailProvider] = mapped_column(Enum(EmailProvider), default=EmailProvider.gmail)

    companies: Mapped[List["Company"]] = relationship("Company", back_populates="user", cascade="all, delete")
    recruiters: Mapped[List["Recruiter"]] = relationship("Recruiter", back_populates="user", cascade="all, delete")
    jobs: Mapped[List["Job"]] = relationship("Job", back_populates="user", cascade="all, delete")
    resumes: Mapped[List["Resume"]] = relationship("Resume", back_populates="user", cascade="all, delete")
    templates: Mapped[List["EmailTemplate"]] = relationship("EmailTemplate", back_populates="user", cascade="all, delete")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="user", cascade="all, delete")
