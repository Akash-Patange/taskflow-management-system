from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse
from core.security import hash_password
from schemas.auth import LoginRequest, Token
from core.security import verify_password, create_access_token

from fastapi.security import OAuth2PasswordRequestForm
from core.dependencies import get_current_user



router= APIRouter(
    prefix="/auth",
    tags= ["Authentication"]
)



@router.post("/register", response_model= UserResponse, status_code= 201)
def register(
    user: UserCreate,
    db: Session= Depends(get_db)
):
    existing_user= db.query(User).filter(User.email== user.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code= 400,
            detail= "Email already registered"
        )
        
    new_user= User(
        username= user.username,
        email= user.email,
        password= hash_password(user.password),
        role= "Member"
    )

    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    
    return new_user





@router.post("/login", response_model= Token)
def login(
    data: LoginRequest,
    db: Session= Depends(get_db)
):
    user= db.query(User).filter(User.email== data.email).first()
    
    if not user:
        raise HTTPException(
            status_code= 401,
            detail= "Invalid email or password"
        )
        
    if not verify_password(
        data.password,
        user.password  # type: ignore
        ):
            raise HTTPException(
                status_code= 401,
                detail= "Invalid email or password"
            )
            
    token= create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user":user
    }
    
    


    
@router.get(
    "/me",
    response_model= UserResponse
    )
def get_me(
    current_user= Depends (get_current_user)
):
    return current_user







@router.post("/token")
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == form_data.username).first()


    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    if not verify_password(
        form_data.password,
        user.password # type: ignore
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )


    return {
        "access_token": token,
        "token_type": "bearer"
    }