from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base



class ProjectMember(Base):
    
    __tablename__= "project_member"
    
    id= Column(Integer, primary_key= True, index= True)
    
    project_id= Column(
        Integer,
        ForeignKey("projects.id", ondelete= "CASCADE"),
        nullable= False
    )
    
    user_id= Column(
        Integer,
        ForeignKey("users.id", ondelete= "CASCADE"),
        nullable= False
    )
    
    project= relationship("Project", back_populates= "member")
    
    user= relationship("User", back_populates= "projects_joined")
    
