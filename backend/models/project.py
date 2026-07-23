from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base


class Project(Base):
    __tablename__= "projects"
    
    id= Column(Integer, primary_key= True, index= True)
    name= Column(String(100), nullable= False)
    description= Column(Text)
    status= Column(String(30), default= "Planning")
    start_date= Column(Date)
    end_date= Column(Date)
    manager_id= Column(Integer, ForeignKey("users.id"), nullable= False)
    
    
    manager= relationship("User", back_populates="project")
    
    member= relationship("ProjectMember", back_populates= "project", cascade= "all, delete-orphan")
    
    task= relationship("Task", back_populates= "project", cascade= "all, delete-orphan")
    
    