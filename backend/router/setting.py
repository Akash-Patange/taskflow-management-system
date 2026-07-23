from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.permission import admin_require

from models.setting import Setting
from schemas.setting import SettingResponse, SettingUpdate


router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)





@router.get(
    "",
    response_model=SettingResponse
)
def get_settings(
    db:Session=Depends(get_db),
    current_user=Depends(admin_require)
):

    setting = db.query(Setting).first()

    if not setting:
        setting = Setting()
        db.add(setting)
        db.commit()
        db.refresh(setting)

    return setting






@router.put(
    "",
    response_model=SettingResponse
)
def update_settings(
    data:SettingUpdate,
    db:Session=Depends(get_db),
    current_user=Depends(admin_require)
):

    setting = db.query(Setting).first()
    
    if not setting:
        setting = Setting()
        db.add(setting)
        db.commit()
        db.refresh(setting)

    update_data = data.model_dump(exclude_unset=True)

    for key,value in update_data.items():
        setattr(
            setting,
            key,
            value
        )

    db.commit()
    db.refresh(setting)

    return setting