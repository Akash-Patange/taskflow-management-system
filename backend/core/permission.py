from fastapi import Depends, HTTPException, status

from sqlalchemy.orm import Session

from core.dependencies import get_current_user
from core.database import get_db

from models.project import Project
from models.task import Task
from models.project import Project
from models.project_member import ProjectMember
from models.comment import Comment


def require_manager_or_admin(
    current_user= Depends(get_current_user)
):
    if current_user.role not in ["Admin", "Manager"]:
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail= "Only Admin or Manager can perform this task."
        )
        
    return current_user





def admin_require(
    current_user= Depends(get_current_user)
):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail= "Only Admin can perform this task."
        )

    return current_user






def manager_require(
    current_user= Depends(get_current_user)
):
    if current_user.role != "Manager":
        raise HTTPException(
             status_code= status.HTTP_403_FORBIDDEN,
            detail= "Only Manager can perform this task."
        )

    return current_user






# Project Ownership permission
def verify_project_owner(
    project_id: int,
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    project= db.query(Project).filter(Project.id== project_id).first()
    
    if not project:
        raise HTTPException(
            status_code= 404,
            detail= "Project not found."
        )
        
    
    if current_user.role== "Admin":
        return project
    
    if (
        current_user.role== "Manager"
        and project.manager_id== current_user.id
    ):
        return project
    
    
    raise HTTPException(
        status_code= 403,
        detail= "You can only access your own project."
    )
    


    

    
# Task Ownership Permission
def verify_task_owner(
    task_id: int,
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    task= db.query(Task).filter(Task.id== task_id).first()
    
    if not task:
        raise HTTPException(
            status_code= 404,
            detail= "Task not found"
        )
        
    project= db.query(Project).filter(Project.id== task.project_id).first()
    
    if current_user.role== "Admin":
        return task
    
    if (
        current_user.role== "Manager"
        and project.manager_id== current_user.id # type: ignore
    ):
        return task
    
    raise HTTPException(
        status_code= 403,
        detail= "You can only access tasks of your own projects."
    )
    
    



    

def verify_project_member(
    task_id: int,
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    
    task= db.query(Task).filter(Task.id== task_id).first()
    
    if not task:
        raise HTTPException(
            status_code= 404,
            detail= "Task Not Found"
        )
        
    project= db.query(Project).filter(Project.id== task.project_id).first()
    
    if not project:
        raise HTTPException(
            status_code= 404,
            detail= "Project Not Found"
        )
        
    if current_user.role== "Admin":
        return task
    
    
    if (
        current_user.role== "Manager"
        and project.manager_id== current_user.id
    ):
        return task
    
    member= (
        db.query(ProjectMember).filter(
            ProjectMember.project_id== project.id,
            ProjectMember.user_id== current_user.id
        ).first()
    )
    
    
    if member:
        return task
    
    
    raise HTTPException(
        status_code= 403,
        detail= "You are not a member of this Project."
    )
    
    
    
    


def verify_task_comment_permission(
    task_id:int,
    db:Session = Depends(get_db),
    current_user= Depends(get_current_user)
):

    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )


    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )


    # Admin can comment
    if current_user.role == "Admin":
        return task


    # Project Manager can comment
    if task.project.manager_id == current_user.id:
        return task



    # Assigned member can comment
    if task.assigned_to == current_user.id:
        return task



    raise HTTPException(
        status_code=403,
        detail="You don't have permission to comment on this task"
    )
    
    
    
    
    


def verify_task_assignee(
    task_id: int,
    current_user= Depends(get_current_user), 
    db: Session= Depends(get_db)
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can update only assigned tasks"
        )


    return task








def verify_comment_permission(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )

    # Admin
    if current_user.role == "Admin":
        return comment


    # Project Manager
    if (
        comment.task
        and comment.task.project
        and comment.task.project.manager_id == current_user.id
    ):
        return comment


    # Comment owner
    if comment.user_id == current_user.id:
        return comment


    raise HTTPException(
        status_code=403,
        detail="You don't have permission."
    )