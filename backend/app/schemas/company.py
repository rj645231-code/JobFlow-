from pydantic import BaseModel, ConfigDict
from typing import Optional, List
import uuid

class CompanyCreate(BaseModel):
    name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None

class CompanyResponse(BaseModel):
    id: uuid.UUID
    name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class CompanyListResponse(BaseModel):
    items: List[CompanyResponse]
    total: int
    page: int
    size: int
