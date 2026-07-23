from pydantic import BaseModel, ConfigDict

from datetime import datetime



class CommentCreate(BaseModel):

    content: str
    
    

class CommentUpdate(BaseModel):

    content: str | None= None



class CommentResponse(BaseModel):
    
    id: int
    content: str
    created_at: datetime | None= None
    username: str | None= None
    
    user_id: int
    task_id: int
    
    model_config= ConfigDict(from_attributes= True)
    
    