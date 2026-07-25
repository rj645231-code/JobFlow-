from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Enum, DateTime
from typing import Optional
from app.models.base import BaseModel
import uuid
import enum
from datetime import datetime

class EmailType(str, enum.Enum):
    initial = "initial"
    followup_1 = "followup_1"
    followup_2 = "followup_2"
    reply = "reply"

class EmailStatus(str, enum.Enum):
    pending = "pending"
    sent = "sent"
    failed = "failed"
    bounced = "bounced"

class EmailHistory(BaseModel):
    __tablename__ = "email_histories"

    application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("applications.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    recruiter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recruiters.id", ondelete="CASCADE"))
    template_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("email_templates.id", ondelete="SET NULL"), nullable=True)
    
    subject: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(Text)
    email_type: Mapped[EmailType] = mapped_column(Enum(EmailType))
    
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    gmail_message_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    gmail_thread_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    status: Mapped[EmailStatus] = mapped_column(Enum(EmailStatus), default=EmailStatus.pending)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    application: Mapped["Application"] = relationship("Application", back_populates="histories")
    template: Mapped[Optional["EmailTemplate"]] = relationship("EmailTemplate", back_populates="histories")
