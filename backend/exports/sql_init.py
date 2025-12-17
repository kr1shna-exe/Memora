import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker
from db.models.user import Base

load_dotenv()

url = URL.create(
    "postgresql",
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASS"),
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    port=os.getenv("DB_PORT")
)

engine = create_engine(url)
Base.metadata.create_all(engine)
session = sessionmaker(bind=engine, autoflush=False)


def db_session():
    db = session()
    try:
        yield db
    finally:
        db.close()
