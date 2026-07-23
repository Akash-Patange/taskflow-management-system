from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import engine, Base
from core.config import settings

import models

from router.auth import router as auth_router
from router.projects import router as projects_router
from router.task import router as task_router
from router.project_member import router as project_member_router
from router.comment import router as comment_router
from router.dashboard import router as dashboard_router


from router.admin import router as admin_router
from router.manager import router as manager_router
from router.member import router as member_router

from router.profile import router as profile_router
from router.setting import router as setting_router



Base.metadata.create_all(bind= engine)



app= FastAPI()





app.add_middleware(
    CORSMiddleware,
    allow_origins= settings.CORS_ORIGNS.split(","),
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)





@app.get("/")
def home():
    
    return {
        "message": "TaskFlow Api Running"
    }
    




app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(task_router)
app.include_router(project_member_router)
app.include_router(comment_router)
app.include_router(dashboard_router)
app.include_router(admin_router)
app.include_router(manager_router)
app.include_router(member_router)
app.include_router(profile_router)
app.include_router(setting_router)