from fastapi import APIRouter, Depends, Query
from datetime import date
from sqlalchemy.orm import Session

from core.database import get_db
from core.dependencies import get_current_user

from models.user import User
from models.task import Task





router = APIRouter(
    prefix="/member",
    tags=["Member"]
)





@router.get("/dashboard")
def member_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    today = date.today()

    my_tasks = db.query(Task).filter(Task.assigned_to == current_user.id)

    total_tasks = my_tasks.count()

    pending_tasks = my_tasks.filter(Task.status == "Pending").count()

    completed_tasks = my_tasks.filter(Task.status == "Completed").count()

    overdue_tasks = my_tasks.filter(Task.due_date < today, Task.status != "Completed").count()

    due_today = my_tasks.filter(Task.due_date == today).count()

    recent_tasks = (
        db.query(Task).filter(Task.assigned_to == current_user.id).order_by(Task.id.desc()).limit(5).all()
    )

    recent = []

    for task in recent_tasks:
        recent.append({
            "id": task.id,
            "title": task.title,
            "priority": task.priority,
            "status": task.status,
            "due_date": task.due_date,
            "project_name": task.project.name if task.project else None
        })

    return {
        "welcome": current_user.username,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks,
        "due_today": due_today,
        "recent_tasks": recent
    }
    
    
    
    
    


@router.get("/tasks")
def get_member_tasks(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Task).filter(Task.assigned_to == current_user.id)

    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))

    if status:
        query = query.filter(Task.status == status)

    if priority:
        query = query.filter(Task.priority == priority)

    total = query.count()

    tasks = (query.offset((page - 1) * limit).limit(limit).all())

    result = []

    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "status": task.status,
            "due_date": task.due_date,
            "project_name": task.project.name if task.project else None
            }
        )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit,
        "tasks": result
    }