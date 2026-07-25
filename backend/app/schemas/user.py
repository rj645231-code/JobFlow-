from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
import uuid

class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    email_provider: str
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
