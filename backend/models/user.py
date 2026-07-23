from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship

from datetime import datetime, timezone

from core.database import Base



class User(Base):
    __tablename__= "users"
    
    id= Column(Integer, primary_key= True, index= True)
    username= Column(String(100), unique= True, nullable= False)
    email= Column(String(100), unique= True, nullable= False)
    password= Column(String(255), nullable= False)
    role= Column(String(20), default= "Member")
    created_at= Column(DateTime, default= datetime.now(timezone.utc))
    is_active= Column(Boolean, default=True)  
    
    
    project= relationship("Project", back_populates= "manager")    
    projects_joined= relationship("ProjectMember", back_populates= "user", cascade= "all, delete-orphan")
    task= relationship("Task", back_populates= "assignee")
    comment= relationship("Comment", back_populates="user", cascade= "all, delete-orphan")
    



