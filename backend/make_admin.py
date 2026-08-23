from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

email = input("Enter the email of the user to make admin: ")

user = db.query(User).filter(User.email == email).first()

if user is None:
    print("User not found")
else:
    user.is_admin = True
    db.commit()
    print(f"{email} is now an admin.")

db.close()