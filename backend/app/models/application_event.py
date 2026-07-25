from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Enum, DateTime
from typing import Optional
from app.models.base import BaseModel
import uuid
import enum
from datetime import datetime

class EventType(str, enum.Enum):
    applied = "applied"
    email_opened = "email_opened"
    followup_sent = "followup_sent"
    reply_received = "reply_received"
    status_changed = "status_changed"
    interview_scheduled = "interview_scheduled"
    offer_received = "offer_received"
    rejected = "rejected"
    note_added = "note_added"

class ApplicationEvent(BaseModel):
    __tablename__ = "application_events"

    application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("applications.id", ondelete="CASCADE"))
    
    event_type: Mapped[EventType] = mapped_column(Enum(EventType))
    old_status: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    new_status: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())

    application: Mapped["Application"] = relationship("Application", back_populates="events")
