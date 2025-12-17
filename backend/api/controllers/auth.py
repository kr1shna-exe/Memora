from datetime import timedelta, datetime
from typing import Optional
from db.models.user import User
from exports.types import UserSchema
from sqlalchemy.orm import Session
import jwt, os, bcrypt
from dotenv import load_dotenv
from fastapi import HTTPException, Request, Cookie

load_dotenv()
jwt_secret = os.getenv("JWT_SECRET")

def create_user(user_data: UserSchema, db: Session):
    user_exists = db.query(User).filter(User.email == user_data.email).first()
    if (user_exists):
        raise HTTPException(status_code=401, detail="User already exists")
    hashed_password = bcrypt.hashpw(user_data.password.encode("utf-8"),bcrypt.gensalt()).decode("utf-8")
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password
    ) 
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=401, detail="Failed to add the user")

def get_user(user_data: UserSchema, db: Session):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    password_check = verify_password(user_data.password, user.password)
    if not password_check:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user

def verify_password(user_password: str, hashed_password: str):
    return bcrypt.checkpw(user_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_token(user: UserSchema):
    # payload = {
    #     "id": user.id,
    #     "email": user.email,
    #     "expires": datetime.now() + timedelta(hours=24)
    # }
    token = jwt.encode({"id": user.id, "email": user.email, "expires": datetime.now() + timedelta(hours=24)}, jwt_secret, algorithms=["HS256"])
    return token

def authenticate_user(request: Request = None):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Token not found")
    try:
        decoded_token = jwt.decode(token, jwt_secret, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    return decoded_token
