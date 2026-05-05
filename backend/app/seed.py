from app.database import Base, engine, SessionLocal
from app.models import User, Task
from app.auth import hash_password


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_user = db.query(User).first()

        if existing_user:
            print("Database already seeded")
            return

        ceo = User(
            username="ceo",
            password_hash=hash_password("123456"),
            role="ceo",
        )

        worker1 = User(
            username="alice",
            password_hash=hash_password("123456"),
            role="worker",
        )

        worker2 = User(
            username="bob",
            password_hash=hash_password("123456"),
            role="worker",
        )

        db.add_all([ceo, worker1, worker2])
        db.commit()

        db.refresh(worker1)
        db.refresh(worker2)

        tasks = [
            Task(
                title="Fix payment bug",
                description="Investigate failed payment flow and patch backend validation.",
                status="in_progress",
                estimated_time=5,
                actual_time=7,
                owner_id=worker1.id,
            ),
            Task(
                title="Prepare sales report",
                description="Collect weekly sales metrics and prepare leadership summary.",
                status="done",
                estimated_time=4,
                actual_time=3,
                owner_id=worker1.id,
            ),
            Task(
                title="Design landing page",
                description="Create modern landing page concept for product launch.",
                status="todo",
                estimated_time=8,
                actual_time=0,
                owner_id=worker2.id,
            ),
            Task(
                title="Customer onboarding audit",
                description="Review onboarding steps and detect friction points.",
                status="blocked",
                estimated_time=6,
                actual_time=10,
                owner_id=worker2.id,
            ),
        ]

        db.add_all(tasks)
        db.commit()

        print("Database seeded successfully")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()