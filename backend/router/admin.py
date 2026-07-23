from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.user import UserResponse, AdminUserUpdate

from core.dependencies import get_current_user


router = APIRouter(
    prefix= "/admin",
    tags= ["Admin"]
)



@router.get("/all")
def get_all_users(
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.id.desc()).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
        for user in users
    ]





@router.get(
    "/users",
    response_model= list[UserResponse]
)
def get_users(
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):
    
    if current_user.role != "Admin":
        raise HTTPException(
            status_code= 403,
            detail= "Admin access required"
        )

    users= db.query(User).all()

    return users






@router.put(
    "/users/{user_id}",
    response_model= UserResponse
)
def update_user(
    user_id:int,
    data:AdminUserUpdate,
    db:Session= Depends(get_db),
    current_user= Depends(get_current_user)
):


    if current_user.role != "Admin":
        raise HTTPException(
            status_code= 403,
            detail= "Admin access required"
        )


    user= db.query(User).filter(User.id == user_id).first()


    if not user:
        raise HTTPException(
            status_code= 404,
            detail= "User not found"
        )

    if data.role is not None:
        user.role= data.role # type: ignore
    
    if data.is_active is not None:    
        user.is_active= data.is_active # type: ignore



    db.commit()
    db.refresh(user)


    return user







@router.delete(
    "/users/{user_id}"
)
def delete_user(
    user_id:int,
    db:Session= Depends(get_db),
    current_user= Depends(get_current_user)
):


    if current_user.role != "Admin":
        raise HTTPException(
            status_code= 403,
            detail= "Admin access required"
        )

    user= db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code= 404,
            detail= "User not found"
        )

    db.delete(user)
    db.commit()


    return {
        "message":"User deleted successfully"
    }