from sqlalchemy import Column, Integer, String, Boolean
from core.database import Base


class Setting(Base):

    __tablename__ = "settings"


    id = Column(Integer, primary_key=True, index=True)
    
    app_name = Column(String(100), default="TaskFlow")
    
    default_priority = Column(String(50), default="Medium")
    
    default_status = Column(String(50), default="Pending")
    
    allow_comments = Column(Boolean, default=True)
    
    notifications = Column(Boolean, default=True)
    
    allow_registration = Column(Boolean,default=True)
    
    default_role = Column(String(50), default="Member")
    
    session_timeout = Column(Integer, default=30)
    
    login_alerts = Column(Boolean, default=True)
    
    force_password_change = Column(Boolean, default=False)