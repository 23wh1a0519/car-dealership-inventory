from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.auth import UserRegister,UserResponse,UserLogin,TokenResponse
from app.services.auth import register_user,login_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db),
):
    return register_user(db, user_data)
@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    return login_user(db, user_data)

