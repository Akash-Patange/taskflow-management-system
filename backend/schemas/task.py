from datetime import date
from pydantic import BaseModel

class TaskCreate(BaseModel):
    
    title: str
    description: str | None= None
    priority: str= "Medium"
    status: str= "Pending"
    due_date: date | None= None
    assigned_to: int | None= None
    
    
class TaskUpdate(BaseModel):
    
    title: str | None= None
    description: str | None= None
    priority: str | None= None
    status: str | None= None
    due_date: date | None= None
    assigned_to: int | None= None
    
    
class TaskResponse(BaseModel):
    
    id: int
    title: str
    description: str | None
    priority: str
    status: str
    due_date: date | None
    project_id: int | None
    project_name: str | None= None
    
    assigned_to: int | None
    assigned_name: str | None
    
    model_config= {
        "from_attributes": True
    }
    
    
class PendingTaskResponse(BaseModel):
    
    id: int
    title: str
    priority: str
    status: str
    due_date: date | None
    project_id: int
    assigned_to: int | None
    
    class Config:
        from_attributes= True
        
        
        
class CompletedTaskResponse(BaseModel):
    
    id: int
    title: str
    priority: str
    status: str
    due_date: date | None
    project_id: int
    assigned_to: int | None
    
    class Config:
        from_attributes= True
        
        
        
class MyTaskResponse(BaseModel):
    
    id: int
    title: str
    description: str | None
    priority: str
    status: str
    due_date: date | None
    project_id: int
    assigned_to: int | None
    
    class Config:
        from_attributes= True
        
        
        
class OverdueTaskResponse(BaseModel):
    
    id: int
    title: str
    description: str | None
    priority: str
    status: str
    due_date: date | None
    project_id: int
    assigned_to: int | None
    
    class Config:
        from_attributes= True
        
        

class HighPriorityTaskResponse(BaseModel):
    
    id: int
    title: str
    description: str | None
    priority: str
    status: str
    due_date: date | None
    project_id: int
    assigned_to: int | None
    
    class Config:
        from_attributes= True
        
        
        
class TaskStatusUpdate(BaseModel):
    
    status: str