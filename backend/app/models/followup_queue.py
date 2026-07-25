from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum, DateTime, Integer
from typing import Optional
from app.models.base import BaseModel
import uuid
import enum
from datetime import datetime

class FollowupStatus(str, enum.Enum):
    pending = "pending"
    sent = "sent"
    cancelled = "cancelled"
    failed = "failed"

class FollowupQueue(BaseModel):
    __tablename__ = "followup_queues"

    application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("applications.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    template_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("email_templates.id", ondelete="CASCADE"))
    
    followup_number: Mapped[int] = mapped_column(Integer)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancel_reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    status: Mapped[FollowupStatus] = mapped_column(Enum(FollowupStatus), default=FollowupStatus.pending)
    celery_task_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    application: Mapped["Application"] = relationship("Application", back_populates="queues")
    template: Mapped["EmailTemplate"] = relationship("EmailTemplate", back_populates="queues")
