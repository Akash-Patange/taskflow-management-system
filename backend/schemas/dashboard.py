from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class DashboardStats(BaseModel):

    total_users: int = 0
    total_projects: int = 0
    total_tasks: int = 0
    completed_tasks: int = 0
    pending_tasks: int = 0
    in_progress_tasks: int = 0
    
    
class RecentProject(BaseModel):

    id: int
    name: str
    status: str
    manager: Optional[str] = None
    
    

class DashboardResponse(BaseModel):

    stats: DashboardStats
    recent_projects: Optional[List[RecentProject]] = None
    
    
    
class ProjectProgressResponse(BaseModel):
    
    project_id: int
    project_name: str
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    progress: float
    
    
    
