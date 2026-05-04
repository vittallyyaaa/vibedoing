from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from app.database import Base, engine, get_db
from app.models import User, Task
from app.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    TaskCreate,
    TaskUpdate,
    TaskResponse,
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_ceo,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VibeDoing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "VibeDoing API is running"}


@app.post("/auth/register", response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if data.role not in ["ceo", "worker"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    existing_user = db.query(User).filter(User.username == data.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role=data.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@app.post("/auth/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@app.get("/auth/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/tasks", response_model=TaskResponse)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "worker":
        raise HTTPException(status_code=403, detail="Only workers can create tasks")

    task = Task(
        title=data.title,
        description=data.description,
        estimated_time=data.estimated_time,
        actual_time=0,
        status="todo",
        owner_id=current_user.id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    employee_id: int | None = Query(default=None),
    status: str | None = Query(default=None),
):
    query = db.query(Task).options(joinedload(Task.owner))

    if current_user.role == "worker":
        query = query.filter(Task.owner_id == current_user.id)

    if current_user.role == "ceo":
        if employee_id:
            query = query.filter(Task.owner_id == employee_id)

        if status:
            query = query.filter(Task.status == status)

    return query.all()


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.role == "worker" and task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can update only your own tasks")

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task


@app.get("/users", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_ceo),
):
    return db.query(User).all()


@app.get("/insights")
def get_ai_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_ceo),
):
    tasks = db.query(Task).options(joinedload(Task.owner)).all()

    overloaded = {}
    risky_tasks = []

    for task in tasks:
        overloaded[task.owner.username] = overloaded.get(task.owner.username, 0) + task.actual_time

        if task.actual_time > task.estimated_time:
            risky_tasks.append({
                "task": task.title,
                "employee": task.owner.username,
                "estimated_time": task.estimated_time,
                "actual_time": task.actual_time,
                "risk": "Actual time exceeds estimated time"
            })

    overloaded_employees = [
        {
            "employee": username,
            "total_actual_time": total,
            "risk": "Possible overload"
        }
        for username, total in overloaded.items()
        if total >= 35
    ]

    return {
        "summary": "AI insights are mocked. The system analyzed workload distribution and execution risks.",
        "overloaded_employees": overloaded_employees,
        "risky_tasks": risky_tasks,
    }