from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime, timezone


class Comment(Base):
    
    __tablename__= "comment"
    
    id= Column(Integer, primary_key= True, index= True)
    content= Column(Text, nullable= False)
    created_at= Column(DateTime, default= datetime.now(timezone.utc))
    
    task_id= Column(Integer, ForeignKey("tasks.id", ondelete= "CASCADE"), nullable= False)
    user_id= Column(Integer, ForeignKey("users.id", ondelete= "CASCADE"), nullable= False)
    
    task= relationship("Task", back_populates= "comment")
    user= relationship("User", back_populates= "comment")


