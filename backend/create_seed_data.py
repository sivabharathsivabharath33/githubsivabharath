from app.database import SessionLocal, Base, engine
from app.models.admin_model import Admin
from app.models.agent_model import Agent
from app.utils.security import hash_password


Base.metadata.create_all(bind=engine)

db = SessionLocal()


def create_admin():
    existing_admin = db.query(Admin).filter(
        Admin.email == "admin@smartsupport.com"
    ).first()

    if existing_admin:
        print("Admin already exists")
        return

    admin = Admin(
        name="System Admin",
        email="admin@smartsupport.com",
        password_hash=hash_password("admin123"),
        role="admin",
        status="active"
    )

    db.add(admin)
    db.commit()
    print("Admin created successfully")


def create_agents():
    agents = [
        {
            "name": "IT Agent",
            "email": "it.agent@smartsupport.com",
            "password": "agent123",
            "request_type": "IT"
        },
        {
            "name": "HR Agent",
            "email": "hr.agent@smartsupport.com",
            "password": "agent123",
            "request_type": "HR"
        },
        {
            "name": "Facilities Agent",
            "email": "facilities.agent@smartsupport.com",
            "password": "agent123",
            "request_type": "Facilities"
        }
    ]

    for agent_data in agents:
        existing_agent = db.query(Agent).filter(
            Agent.email == agent_data["email"]
        ).first()

        if existing_agent:
            print(f"{agent_data['name']} already exists")
            continue

        agent = Agent(
            name=agent_data["name"],
            email=agent_data["email"],
            password_hash=hash_password(agent_data["password"]),
            request_type=agent_data["request_type"],
            role="agent",
            status="active"
        )

        db.add(agent)

    db.commit()
    print("Agents created successfully")


create_admin()
create_agents()

db.close()