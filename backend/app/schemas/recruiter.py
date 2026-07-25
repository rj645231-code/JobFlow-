from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
import uuid

class RecruiterCreate(BaseModel):
    company_id: Optional[uuid.UUID] = None
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None

class RecruiterUpdate(BaseModel):
    company_id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None

class RecruiterResponse(BaseModel):
    id: uuid.UUID
    company_id: Optional[uuid.UUID] = None
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class RecruiterListResponse(BaseModel):
    items: List[RecruiterResponse]
    total: int
    page: int
    size: int

class CSVImportResponse(BaseModel):
    imported_count: int
    errors: List[str]
