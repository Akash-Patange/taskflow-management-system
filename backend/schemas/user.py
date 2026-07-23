from pydantic import BaseModel, EmailStr

from datetime import datetime

from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    

class UserUpdate(BaseModel):
    username: str
    email: EmailStr
    
    
    
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes= True
    
        
        
class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None
        
        

class ProfileUpdate(BaseModel):
    username: str
    email: EmailStr




class ChangePassword(BaseModel):
    old_password: str
    new_password: str