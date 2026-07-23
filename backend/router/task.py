from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy.orm import Session

from core.database import get_db
from core.permission import verify_project_owner, verify_task_owner
from core.dependencies import get_current_user

from models.project import Project
from models.task import Task
from models.user import User

from schemas.task import TaskCreate, TaskResponse, TaskUpdate, TaskStatusUpdate




router= APIRouter(
    prefix= "/tasks",
    tags= ["Tasks"]
)






@router.post(
    "/{project_id}/tasks",
    response_model= TaskResponse,
    status_code= 201
    )
def create_task(
    task_data: TaskCreate,
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):
    if task_data.assigned_to is not None:
        assigned_user= db.query(User).filter(User.id== task_data.assigned_to).first()
        
        if not assigned_user:
            raise HTTPException(
                status_code= 404,
                detail= "Assigned user not found."
            )
            
    new_task= Task(
        title= task_data.title,
        description= task_data.description,
        priority= task_data.priority,
        status= task_data.status,
        due_date= task_data.due_date,
        project_id= project.id,
        assigned_to= task_data.assigned_to
    )
    
        
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    assigned_name = None

    if new_task.assigned_to: # type: ignore
        user = db.query(User).filter(User.id == new_task.assigned_to).first()

    if user: # type: ignore
        assigned_name = user.username



    return {
        "id": new_task.id,
        "title": new_task.title,
        "description": new_task.description,
        "priority": new_task.priority,
        "status": new_task.status,
        "due_date": new_task.due_date,
        "project_id": new_task.project_id,
        "project_name": project.name,
        "assigned_to": new_task.assigned_to,
        "assigned_name": assigned_name
    }






@router.get("/tasks")
def get_tasks(
    page: int= Query(1, ge=1),
    limit: int= Query(10, ge=1, le= 100),
    search: str | None= None,
    status: str | None= None,
    priority: str | None= None,
    project_id: str | None= None,
    assigned_to: int | None= None,
    db: Session= Depends(get_db)
):
    query= db.query(Task)
    
    if search: query= query.filter(Task.title.ilike(f"%{search}%"))
    
    if status: query= query.filter(Task.status== status)
    
    if priority: query= query.filter(Task.priority== priority)
    
    if project_id: query= query.filter(Task.project_id== project_id)
    
    if assigned_to: query= query.filter(Task.assigned_to== assigned_to)
    
    total= query.count()
    
    tasks= (query.offset((page - 1) * limit).limit(limit).all())
    
    result= []
    
    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "status": task.status,
            "due_date": task.due_date,
            "project_id": task.project_id,
            "project_name": task.project.name if task.project else None,
            "assigned_to": task.assigned_to,
            "assigned_name": task.assignee.username if task.assignee else None
            }
        )
    
    
    
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_page": (total + limit-1)//limit,
        "tasks": result
    }
    




    
    
    
@router.get("/my-tasks")
def get_my_tasks(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = (
        db.query(Project).filter(Project.manager_id == current_user.id).all()
    )

    project_ids = [ project.id for project in projects]

    query = (
        db.query(Task).filter(Task.project_id.in_(project_ids))
    )


    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))


    if status:
        query = query.filter(Task.status == status)


    if priority:
        query = query.filter(Task.priority == priority)


    total = query.count()


    tasks = (query.offset((page-1)*limit).limit(limit).all())


    result = []

    
    for task in tasks:
        result.append(
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "status": task.status,
                "due_date": task.due_date,
                "project_id": task.project_id,
                "project_name": (task.project.name if task.project else None),
                "assigned_to": task.assigned_to,
                "assigned_name": (task.assignee.username    if task.assignee    else None)
            }
        )


    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": ((total + limit - 1)//limit),
        "tasks": result
    }

    
    


    
    
@router.get(
    "/project-by/{project_id}/tasks",
    response_model= list[TaskResponse]
    )
def get_project_task(
    project_id: int,
    db: Session= Depends(get_db)
):
    
    tasks= (db.query(Task).filter(Task.project_id== project_id).all())
    
    result=[]

    for task in tasks:
    
        assigned_name = None

        if task.assigned_to: # type: ignore
            user = db.query(User).filter(User.id == task.assigned_to).first()
        
        if user: # type: ignore
            assigned_name = user.username



        result.append(
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "status": task.status,
                "due_date": task.due_date,
                "project_id": task.project_id,
                "assigned_to": task.assigned_to,
                "assigned_name": assigned_name
            }
        )
        
        
    return result







@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = (
        db.query(Task).filter(Task.id == task_id).first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )



    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "status": task.status,
        "due_date": task.due_date,
        "project_id": task.project_id,
        "project_name": task.project.name if task.project else None,
        "assigned_to": task.assigned_to,
        "assigned_name": task.assignee.username if task.assignee else None
    }








@router.put(
    "/tasks/{task_id}",
    response_model= TaskResponse
    )
def update_task(
    task_data: TaskUpdate,
    task: Task= Depends(verify_task_owner),
    db: Session= Depends(get_db)
):
    
    update_data= task_data.model_dump(exclude_unset= True)
    
    for key, value in update_data.items():
        setattr(task, key, value)
        
    
    db.commit()
    db.refresh(task)
    
    
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "status": task.status,
        "due_date": task.due_date,
        "project_id": task.project_id,
        "project_name": task.project.name if task.project else None,
        "assigned_to": task.assigned_to,
        "assigned_name": task.assignee.username if task.assignee else None
    }
    
 
 
 
 
 

@router.put(
    "/{task_id}/status",
    )
def update_task_status(
    task_id:int,
    status_data: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.assigned_to != current_user.id: # type: ignore
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )


    allowed_changes = {
        "Pending": ["In Progress"],
        "In Progress": ["Completed", "On Hold"],
        "On Hold": ["In Progress"]
    }
    

    current_status = task.status
    new_status = status_data.status

    if new_status not in allowed_changes.get(current_status, []): # type: ignore
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change {current_status} to {new_status}"
        )


    task.status = new_status # type: ignore
    db.commit()
    db.refresh(task)



    return {
        "message":"Task status updated successfully",
        "status":task.status
    }
    
       





@router.delete("/tasks/{task_id}")
def delete_task(
    task: Task= Depends(verify_task_owner),
    db: Session= Depends(get_db)
):
    
    db.delete(task)
    db.commit()

    
    return{
        "message": "Task deleted successfully."
    }
    
    
    
