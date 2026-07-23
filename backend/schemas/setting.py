from pydantic import BaseModel


class SettingResponse(BaseModel):

    id:int

    app_name:str

    default_priority:str

    default_status:str

    allow_comments:bool

    notifications:bool

    allow_registration:bool

    default_role:str

    session_timeout:int

    login_alerts:bool

    force_password_change:bool


    class Config:
        from_attributes=True






class SettingUpdate(BaseModel):

    app_name:str | None = None

    default_priority:str | None = None

    default_status:str | None = None

    allow_comments:bool | None = None

    notifications:bool | None = None

    allow_registration:bool | None = None

    default_role:str | None = None

    session_timeout:int | None = None

    login_alerts:bool | None = None

    force_password_change:bool | None = None