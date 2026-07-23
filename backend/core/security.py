from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from core.config import settings


pwd_context= CryptContext(
    schemes= ["bcrypt"],
    deprecated= "auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )



def create_access_token(data:dict):
    
    to_encode= data.copy()
    
    expire= datetime.now(timezone.utc) + timedelta(minutes= settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update(
        {
            "exp":expire
        }
    )
    
    
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm= settings.ALGORITHM
    )
    
    
    
    
# hash_password()
# verify_password()
# create_access_token()
# verify_token()
# get_current_user()
# 0auth2_scheme