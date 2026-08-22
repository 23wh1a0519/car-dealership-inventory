from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import create_access_token
from app.schemas.auth import UserRegister,UserLogin
def register_user(db: Session, user_data: UserRegister):
    user = User(
        email=user_data.email,
        password=user_data.password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
def login_user(db: Session, user_data: UserLogin):
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )
    if user is None or user.password != user_data.password:
        return None
    access_token = create_access_token(
        {"sub": str(user.id),"is_admin": user.is_admin,}
    )
    return {"access_token": access_token,"token_type": "bearer"}