from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker
from db.models.user import Base
from config.settings import settings

url = URL.create(
    "postgresql",
    username=settings.DB_USERNAME,
    password=settings.DB_PASS,
    host=settings.DB_HOST,
    database=settings.DB_NAME,
    port=settings.DB_PORT
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
