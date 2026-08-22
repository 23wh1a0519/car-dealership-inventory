from pydantic import BaseModel
class UserRegister(BaseModel):
    email: str
    password: str
class UserLogin(BaseModel):
    email: str
    password: str
class TokenResponse(BaseModel):
    access_token: str
class UserResponse(BaseModel):
    id: int
    email: str
    class Config:
        from_attributes = True