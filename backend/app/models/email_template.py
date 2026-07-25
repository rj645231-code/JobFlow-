from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, JSON, Boolean
from typing import List, Dict, Any, Optional
from app.models.base import BaseModel
import uuid

class EmailTemplate(BaseModel):
    __tablename__ = "email_templates"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    
    name: Mapped[str] = mapped_column(String)
    subject: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(Text)
    variables_used: Mapped[List[str]] = mapped_column(JSON, default=list)
    is_followup: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="templates")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="template")
    histories: Mapped[List["EmailHistory"]] = relationship("EmailHistory", back_populates="template")
    queues: Mapped[List["FollowupQueue"]] = relationship("FollowupQueue", back_populates="template")
