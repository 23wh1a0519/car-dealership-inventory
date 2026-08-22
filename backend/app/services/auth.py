from sqlalchemy.orm import Session
from app.models.user import User
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

    return {"access_token": "dummy-token"}