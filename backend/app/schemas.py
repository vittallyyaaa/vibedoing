from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "worker"


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    estimated_time: float


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    estimated_time: Optional[float] = None
    actual_time: Optional[float] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    estimated_time: float
    actual_time: float
    owner_id: int
    owner: UserResponse

    class Config:
        from_attributes = True