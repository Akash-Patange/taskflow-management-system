from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base


class Task(Base):
    
    __tablename__= "tasks"
    
    id= Column(Integer, primary_key= True, index= True)
    title= Column(String(150), nullable= False)
    description= Column(Text)
    priority= Column(String(20), default= "Medium")
    status= Column(String(30), default= "Pending")
    due_date= Column(Date)
    
    
    project_id= Column(Integer, ForeignKey("projects.id", ondelete= "SET NULL"), nullable= True)
    
    assigned_to = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable= True)
    
    project= relationship("Project", back_populates= "task")
    
    assignee= relationship("User", back_populates= "task")
    
    comment= relationship("Comment", back_populates= "task", cascade= "all, delete-orphan")
    
    
    