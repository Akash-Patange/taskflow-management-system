from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy.orm import Session

from core.database import get_db
from core.dependencies import get_current_user
from core.permission import require_manager_or_admin, verify_project_owner, manager_require

from models.project import Project
from models.user import User

from schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate




router= APIRouter(
    prefix= "/projects",
    tags= ["projects"]
)




@router.post(
    "",
    response_model= ProjectResponse,
    status_code= 201
    )
def create_project(
    project: ProjectCreate,
    db: Session= Depends(get_db),
    current_user= Depends(require_manager_or_admin)
):
        
    new_project= Project(
        name= project.name,
        description= project.description,
        status= project.status,
        start_date= project.start_date,
        end_date= project.end_date,
        manager_id= current_user.id
    )
    
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    
    return new_project







@router.get("/manager-projects")
def my_manager_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(manager_require)
):

    query = db.query(Project).filter(Project.manager_id == current_user.id)
    
    if search:
        query = query.filter(Project.name.ilike(f"%{search}%"))
        
    if status:
        query = query.filter(Project.status == status)

    total = query.count()

    projects = (
        query.order_by(Project.id.desc()).offset((page-1)*limit).limit(limit).all()
    )

    
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1)//limit,
        "projects": projects
    }







@router.get("/all")
def get_all_projects(
    db: Session = Depends(get_db)
):

    projects = db.query(Project).order_by(Project.id.desc()).all()


    return [
        {
            "id": project.id,
            "name": project.name
        }

        for project in projects
    ]






@router.get("/")
def get_projects(
    page: int= Query(1, ge= 1),
    limit: int= Query(10, ge= 1, le= 100),
    search: str | None= None,
    status: str | None= None,
    db: Session= Depends(get_db)
):
    query= db.query(Project)
    
    if search:
        query= query.filter(Project.name.ilike(f"%{search}%"))
        
    if status:
        query= query.filter(Project.status== status)
        
    total= query.count()
    
    projects = (query.order_by(Project.id.desc()).offset((page - 1) * limit).limit(limit).all())

    
    return{
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit,
        "projects": projects
    }
    
    
    



    
@router.get("/{project_id}", response_model= ProjectResponse)
def get_project(
    project_id: int,
    db: Session= Depends(get_db)
):
    project= db.query(Project).filter(Project.id== project_id).first()
    
    if not project:
        raise HTTPException(
            status_code= 404,
            detail= "Project not found"
        )
        
    return project





@router.put("/{project_id}", response_model= ProjectResponse)
def update_project(
    project_data: ProjectUpdate,
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):
            
    update_data = project_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(project, key, value)
    
    
    db.commit()
    db.refresh(project)
    
    
    return project






@router.delete("/{project_id}")
def delete_project(
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):

    
    db.delete(project)
    db.commit()


    
    return{
        "message": "Project deleted Successfully."
    }
    
    
