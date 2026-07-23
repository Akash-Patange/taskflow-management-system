from pydantic import BaseModel, config
from datetime import date
from typing import Optional


class ProjectCreate(BaseModel):
    
    name: str
    description: Optional[str]= None
    status: str= "Planning"
    start_date: Optional[date]= None
    end_date: Optional[date]= None
    
    
class ProjectUpdate(BaseModel):
    
    name: str
    description: Optional[str]= None
    status: Optional[str]= None
    start_date: Optional[date]= None
    end_date: Optional[date]= None
    
    
class ProjectResponse(BaseModel):
    
    id: int
    name: str
    description: Optional[str]
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    manager_id: int
    
    class Config:
        from_attributes= True