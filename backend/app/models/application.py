from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum, DateTime, Integer, Text
from typing import List, Optional
from app.models.base import BaseModel
import uuid
import enum
from datetime import datetime

class ApplicationStatus(str, enum.Enum):
    draft = "draft"
    ready = "ready"
    applied = "applied"
    followup_1 = "followup_1"
    followup_2 = "followup_2"
    interview = "interview"
    assignment = "assignment"
    hr_round = "hr_round"
    technical_round = "technical_round"
    offer = "offer"
    rejected = "rejected"
    ghosted = "ghosted"
    accepted = "accepted"

class Application(BaseModel):
    __tablename__ = "applications"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    recruiter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recruiters.id", ondelete="CASCADE"))
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"))
    job_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    resume_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    template_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("email_templates.id", ondelete="SET NULL"), nullable=True)
    
    status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus), default=ApplicationStatus.draft)
    
    applied_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    followup_interval_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    next_followup_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    replied_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="applications")
    recruiter: Mapped["Recruiter"] = relationship("Recruiter", back_populates="applications")
    company: Mapped["Company"] = relationship("Company", back_populates="applications")
    job: Mapped[Optional["Job"]] = relationship("Job", back_populates="applications")
    resume: Mapped[Optional["Resume"]] = relationship("Resume", back_populates="applications")
    template: Mapped[Optional["EmailTemplate"]] = relationship("EmailTemplate", back_populates="applications")
    
    histories: Mapped[List["EmailHistory"]] = relationship("EmailHistory", back_populates="application", cascade="all, delete")
    queues: Mapped[List["FollowupQueue"]] = relationship("FollowupQueue", back_populates="application", cascade="all, delete")
    events: Mapped[List["ApplicationEvent"]] = relationship("ApplicationEvent", back_populates="application", cascade="all, delete")
