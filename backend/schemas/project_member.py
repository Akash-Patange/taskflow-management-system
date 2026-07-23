from pydantic import BaseModel, ConfigDict


class ProjectMemberCreate(BaseModel):
    
    user_id: int
    
    

class ProjectMemberResponse(BaseModel):
    
    id: int
    project_id: int
    user_id: int
    username: str
    email: str
    
    model_config= ConfigDict(from_attributes= True)
    
    
class ProjectMemberUserResponse(BaseModel):

    id:int
    username:str
    email:str
    role:str

    model_config = ConfigDict(from_attributes=True)