from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from core.database import get_db
from core.permission import manager_require

from models.project import Project
from models.task import Task
from models.user import User



router = APIRouter(
    prefix="/manager",
    tags=["Manager"]
)




@router.get("/dashboard")
def manager_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(manager_require)
):
    
    total_projects = (
        db.query(Project).filter(Project.manager_id == current_user.id).count()
    )
    
    active_projects = (
        db.query(Project).filter(Project.manager_id == current_user.id, Project.status == "active").count()
    )

    project_ids = [
        project.id for project in db.query(Project).filter(Project.manager_id == current_user.id).all()
    ]

    total_tasks = (
        db.query(Task).filter(Task.project_id.in_(project_ids)).count()
    )

    completed_tasks = (
        db.query(Task).filter(Task.project_id.in_(project_ids), Task.status == "completed").count()
    )

    pending_tasks = total_tasks - completed_tasks

    team_members = (
        db.query(User).join(Project.member).filter(Project.manager_id == current_user.id).distinct().count()
    )


    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "team_members": team_members
    }