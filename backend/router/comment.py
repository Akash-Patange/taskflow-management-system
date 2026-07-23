from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy.orm import Session

from core.permission import verify_project_member, verify_task_comment_permission, admin_require, verify_comment_permission
from core.database import get_db
from core.dependencies import get_current_user

from models.task import Task
from models.comment import Comment

from schemas.comment import CommentCreate, CommentUpdate, CommentResponse





router= APIRouter(
    prefix="/comments",
    tags= ["Comment"]
)




@router.post(
    "/{task_id}/comment",
    response_model= CommentResponse
    )
def create_comment(
    comment_data: CommentCreate,
    task: Task= Depends(verify_task_comment_permission),
    db: Session= Depends(get_db),
    current_user= Depends(get_current_user)
):

    comment= Comment(
        content= comment_data.content,
        task_id= task.id,
        user_id= current_user.id
    )

    
    db.add(comment)
    db.commit()
    db.refresh(comment)


    
    return {
        "id": comment.id,
        "content": comment.content,
        "task_id": comment.task_id,
        "user_id": comment.user_id,
        "username": current_user.username,
        "created_at": comment.created_at
    }






@router.get("/all")
def get_all_comments(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    task_id: int | None = None,
    user_id: int | None = None,
    project_id: int | None = None,
    db: Session = Depends(get_db),
    current_user= Depends(admin_require)
):

    query = db.query(Comment)

    if search: 
        query = query.filter(Comment.content.ilike(f"%{search}%"))

    if task_id:
        query = query.filter(Comment.task_id == task_id)

    if user_id:
        query = query.filter(Comment.user_id == user_id)
        
    if project_id:
        query = (query.join(Task).filter(Task.project_id == project_id))


    total = query.count()

    comments = (query.order_by(Comment.id.desc()).offset((page-1)*limit).limit(limit).all())

    result=[]


    for comment in comments:
        result.append({
            "id": comment.id,
            "content": comment.content,
            "task_id": comment.task_id,
            "task_name": comment.task.title if comment.task else None,
            "project_id": comment.task.project_id if comment.task else None,
            "project_name": comment.task.project.name if comment.task and comment.task.project else None,
            "user_id": comment.user_id,
            "username": comment.user.username if comment.user else None,
            "created_at": comment.created_at
            }
        )



    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1)//limit,
        "comments": result
    }







@router.get(
    "/task/{task_id}",
    response_model=list[CommentResponse]
)
def get_task_comment(
    task: Task = Depends(verify_project_member),
    db: Session = Depends(get_db)
):

    comments = (db.query(Comment).filter(Comment.task_id == task.id).all())

    result = []

    for comment in comments:
        result.append({
            "id": comment.id,
            "content": comment.content,
            "created_at": comment.created_at,
            "username": (comment.user.username if comment.user else None),
            "user_id": comment.user_id,
            "task_id": comment.task_id
            }
        )


    return result
    
 



 
 
 
@router.get(
    "/project/{project_id}",
    response_model= list[CommentResponse]
)
def get_project_comments(
    project_id: int,
    db: Session = Depends(get_db)
):

    comments = (db.query(Comment).join(Task).filter(Task.project_id == project_id).all())

    result = []

    for comment in comments:
        result.append(
            {
                "id": comment.id,
                "content": comment.content,
                "created_at": comment.created_at,
                "username": (comment.user.username if comment.user else None),
                "user_id": comment.user_id,
                "task_id": comment.task_id
            }
        )



    return result  







@router.get("/{comment_id}")
def get_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(admin_require)
):
    comment = (db.query(Comment).filter(Comment.id == comment_id).first())

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )



    return {
        "id": comment.id,
        "content": comment.content,
        "username": comment.user.username if comment.user else None,
        "project_name": comment.task.project.name if comment.task and comment.task.project else None,
        "task_title": comment.task.title if comment.task else None,
        "created_at": comment.created_at
    }

    



    
@router.put(
    "/{comment_id}",
    response_model= CommentResponse
    )
def update_comment(
    comment_data: CommentUpdate,
    comment: Comment= Depends(verify_comment_permission),
    db: Session= Depends(get_db)
):

    update_data= comment_data.model_dump(exclude_unset= True)
    
    for key, value in update_data.items():
        setattr(comment, key, value)
        
        
    db.commit()
    db.refresh(comment)


    
    return comment








@router.delete("/{comment_id}")
def delete_comment(
    comment: Comment= Depends(verify_comment_permission),
    db: Session= Depends(get_db)
):

    db.delete(comment)
    db.commit()
    
    return{
        "message": "Comment deleted successfully"
    }
    
    
    
    
