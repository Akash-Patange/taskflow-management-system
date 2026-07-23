from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy.orm import Session

from core.database import get_db
from core.permission import verify_project_owner, verify_task_owner

from schemas.project_member import ProjectMemberCreate, ProjectMemberResponse

from models.project_member import ProjectMember
from models.user import User
from models.project import Project




router= APIRouter(
    prefix= "/projects",
    tags= ["project_member"]
)






@router.post("/{project_id}/members", response_model= ProjectMemberResponse, status_code= 201)
def add_project_member(
    member: ProjectMemberCreate,
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):
    user= db.query(User).filter(User.id== member.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code= 404,
            detail= "User not found."
        )
        
    existing_member= (
        db.query(ProjectMember).filter(
                    ProjectMember.project_id== project.id,
                    ProjectMember.user_id== member.user_id).first()
    )
    
    if existing_member:
        raise HTTPException(
            status_code= 400,
            detail= "User is already a member of this Project."
        )
        
    new_member= ProjectMember(
        project_id= project.id,
        user_id= member.user_id
    )
    
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)


    member_response = (
        db.query(
            ProjectMember.id,
            ProjectMember.project_id,
            User.id.label("user_id"),
            User.username,
            User.email,
            User.role
        ).join(User, User.id == ProjectMember.user_id).filter(ProjectMember.id == new_member.id).first()
    )


    return member_response








@router.get(
    "/{project_id}/members",
    response_model= list [ProjectMemberResponse]
    )
def get_project_members(
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):
    
    members = (
        db.query(
            ProjectMember.id,
            ProjectMember.project_id,
            User.id.label("user_id"),
            User.username,
            User.email
        ).join(User, User.id == ProjectMember.user_id).filter(ProjectMember.project_id == project.id).all()
    )


    return members





@router.delete("/{project_id}/members")
def remove_project_member(
    user_id: int,
    project: Project= Depends(verify_project_owner),
    db: Session= Depends(get_db)
):
    member= (
        db.query(ProjectMember).filter(
            ProjectMember.project_id== project.id,
            ProjectMember.user_id== user_id).first()
    )
    
    if not member:
        raise HTTPException(
            status_code= 404,
            detail= "Member not found in this project."
        )
        
        
        
    db.delete(member)
    db.commit()
    
    
    
    return{
        "message": "Member removed Successfully."
    }