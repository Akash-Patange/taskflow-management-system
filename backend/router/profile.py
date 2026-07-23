from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.dependencies import get_current_user
from core.security import verify_password, hash_password

from models.user import User

from schemas.user import ProfileUpdate, ChangePassword





router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)







@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user)
):


    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at
    }








@router.put("/username")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_email = (
        db.query(User).filter(User.email == data.email, User.id != current_user.id).first()
    )


    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )


    current_user.username = data.username # type: ignore
    
    db.commit()
    db.refresh(current_user)

    return {
        "message":"Profile updated successfully"
    }







@router.put("/change-password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not verify_password(
        data.old_password,
        current_user.password # type: ignore
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password incorrect"
        )


    current_user.password = hash_password(data.new_password) # type: ignore


    db.commit()


    return {
        "message":"Password changed successfully"
    }