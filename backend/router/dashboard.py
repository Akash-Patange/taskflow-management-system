from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from datetime import date

from core.database import get_db
from core.dependencies import get_current_user
from core.permission import verify_project_owner

from models.user import User
from models.project import Project
from models.task import Task
from models.comment import Comment
from models.project_member import ProjectMember

from schemas.dashboard import DashboardResponse, ProjectProgressResponse
from schemas.project import ProjectResponse
from schemas.comment import CommentResponse
from schemas.task import PendingTaskResponse, CompletedTaskResponse, MyTaskResponse, OverdueTaskResponse, HighPriorityTaskResponse






router= APIRouter(
    prefix= "/dashboard",
    tags= ["Dashboard"]
)





@router.get("", response_model= DashboardResponse)
def dashboard_summary(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
        
    if current_user.role== "Admin":

        recent_projects = (
            db.query(Project).order_by(Project.id.desc()).limit(5).all()
        )



        return {
            "stats": {
                "total_users": db.query(User).count(),
                "total_projects": db.query(Project).count(),
                "active_projects": db.query(Project).filter(Project.status=="In Progress").count(),
                "completed_projects": db.query(Task).filter(Task.status=="Completed").count()
            },

            "recent_projects": [
                    {
                        "id": project.id,
                        "name": project.name,
                        "status": project.status,
                        "manager": project.manager.username if project.manager else "Not Assigned"
                    }

                    for project in recent_projects
                ]
        }
        

        
        
        

@router.get(
    "/projects/{project_id}/progress",
    response_model= ProjectProgressResponse)
def project_progress(
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):
    total_tasks= (
            db.query(Task).filter(Task.project_id== project.id).count()
    )


    completed_tasks= (
            db.query(Task).filter(
                        Task.project_id== project.id,
                        Task.status== "Completed").count()
    )    

    
    pending_tasks= (
                db.query(Task).filter(
                        Task.project_id== project.id,
                        Task.status== "Pending").count()
    )
    
    
    in_progress_tasks= (
                db.query(Task).filter(
                            Task.project_id== project.id,
                            Task.status== "In Progress").count()
    )
    
    
    if total_tasks== 0:
        progress= 0
    
        
    else:
        progress= round((completed_tasks / total_tasks) * 100, 2)
        
    
    
    return ProjectProgressResponse(    
        project_id= project.id, # type: ignore
        project_name= project.name, # type: ignore
        total_tasks= total_tasks,
        pending_tasks= pending_tasks,
        completed_tasks= completed_tasks,
        in_progress_tasks= in_progress_tasks,
        progress= progress
    )
    
    
    
    
    
    
    
@router.get(
    "/tasks/pending",
    response_model= list[PendingTaskResponse]
    )
def get_pending_tasks(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    if current_user.role== "Admin":
    
        
        return(
            db.query(Task).filter(Task.status== "Pending").all()
        )
        
    elif current_user.role== "Manager":
        
        project_ids= [
            Project.id for project in db.query(Project).filter(Project.manager_id== current_user.id).all()
        ]
        
        return(
            db.query(Task).filter(
                        Task.project_id.in_(project_ids), 
                        Task.status== "Pending").all()
        )
        
    else:
        return(
            db.query(Task).filter(
                        Task.assigned_to== current_user.id, 
                        Task.status== "Pending").all()
        )
        
        
        
        
        
        
        
@router.get(
    "/tasks/completed",
    response_model= list[CompletedTaskResponse]
    )
def get_completed_tasks(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    
    if current_user.role== "Admin":
        return(
            db.query(Task).filter(Task.status== "Completed").all()
        )
        
    elif current_user.role== "Manager":
        project_ids= [
            project.id for project in db.query(Project).filter(Project.manager_id== current_user.id).all()
        ]
        
        return (
            db.query(Task).filter(Task.project_id.in_(project_ids), Task.status== "Completed").all()
        )
        
    else: 
        return(
            db.query(Task).filter(
                        Task.assigned_to== current_user.id,
                        Task.status== "Completed").all()
        )
        
        
        
        
        
        
        
        
@router.get(
    "/tasks/my",
    response_model= list[MyTaskResponse]
    )
def get_my_tasks(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    tasks= (
        db.query(Task).filter(Task.assigned_to== current_user.id).all()
    )
    
    
    return tasks








@router.get(
    "/tasks/overdue",
    response_model= list[OverdueTaskResponse]
)
def get_overdue_tasks(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    today= date.today()
    
    if current_user.role== "Admin":
        return(
            db.query(Task).filter(
                        Task.due_date< today,
                        Task.status != "Completed").all()
        )
        
    elif current_user.role== "Manager":
        
        project_ids= [
            project.id for project in db.query(Project).filter(Project.manager_id== current_user.id).all()
        ]
        
        return(
            db.query(Task).filter(
                        Task.project_id.in_(project_ids),
                        Task.due_date< today,
                        Task.status != "Completed").all()
        )
        
        
    else:
        return (
            db.query(Task).filter(
                        Task.assigned_to== current_user.id,
                        Task.due_date< today,
                        Task.status != "Completed").all()
        )
        
        
        
        
        
        
        
@router.get(
    "/tasks/high_priority",
    response_model= list[HighPriorityTaskResponse]
    )
def get_high_priority_tasks(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    
    if current_user.role== "Admin":
        
        return(
            db.query(Task).filter(Task.priority== "High").all()
        )
        
    elif current_user.role== "Manager":
        project_ids= [
            project.id for project in db.query(Project).filter(Project.manager_id== current_user.id).all()
        ]
        
        return(
            db.query(Task).filter(Task.project_id.in_(project_ids), Task.priority== "High").all()
        )
        
    else: 
        return(
            db.query(Task).filter(
                        Task.assigned_to== current_user.id, 
                        Task.priority== "High").all()
        )
        
        
        
        
        
        
        
        
@router.get(
    "/projects/recent",
    response_model= list[ProjectResponse]
    )
def get_recent_project(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    if current_user.role== "Admin":
        return (
            db.query(Project).order_by(Project.id.desc()).limit(5).all()
        )
        
    elif current_user.role== "Manager":
        return (
            db.query(Project).filter(Project.manager_id== current_user.id).order_by(Project.id.desc()).limit(5).all()
        )
        
    raise HTTPException(
        status_code= 403,
        detail= "You are not authorized to access recent projects."
    )
    
    
    
    
    
    
    
    
@router.get(
    "/recent/comment",
    response_model= list[CommentResponse]
    )
def get_recent_comments(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    if current_user.role== "Admin":
        
        return(
            db.query(Comment).order_by(Comment.created_at.desc()).limit(10).all()
        )
    
    elif current_user.role== "Manager":
        
        return(
            db.query(Comment).join(Task, Comment.task_id== Task.id).filter(
                Project.manager_id== current_user.id).order_by(Comment.created_at.desc()).limit(10).all()
        )
        
    elif current_user.role=="Employee":
        
        return(
            db.query(Comment).join(
                    Task, Comment.task_id== Task.id).join(
                        Project, Task.project_id== Project.id).join(
                            ProjectMember, ProjectMember.project_id== Project.id).filter(
                                ProjectMember.user_id== current_user.id).order_by(
                                    Comment.created_at.desc()).limit(10).all()
        )
        
    raise HTTPException(
        status_code= 403,
        detail= "You are not authorized to view recent comments."
    )