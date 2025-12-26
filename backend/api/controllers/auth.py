from datetime import timedelta, datetime
from db.models.user import User
from exports.types import RegisterSchema, LoginSchema
from sqlalchemy.orm import Session
import jwt, bcrypt
from fastapi import HTTPException, Request
from config.settings import settings

def create_user(user_data: RegisterSchema, db: Session):
    user_exists = db.query(User).filter(User.email == user_data.email).first()
    if user_exists:
        raise HTTPException(status_code=401, detail="User already exists")
    hashed_password = bcrypt.hashpw(
        user_data.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")
    new_user = User(
        username=user_data.username, email=user_data.email, password=hashed_password
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


def get_user(user_data: LoginSchema, db: Session):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    password_check = verify_password(user_data.password, user.password)
    if not password_check:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user


def verify_password(user_password: str, hashed_password: str):
    return bcrypt.checkpw(
        user_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def create_token(user: User):
    # payload = {
    #     "id": user.id,
    #     "email": user.email,
    #     "expires": datetime.now() + timedelta(hours=24)
    # }
    token = jwt.encode(
        {
            "id": user.id,
            "email": user.email,
            "expires": (datetime.now() + timedelta(hours=24)).timestamp(),
        },
        settings.JWT_SECRET,
        algorithm="HS256",
    )
    return token

def get_current_user(request: Request, db: Session):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        decodedToken = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        if decodedToken.get("expires", 0) < datetime.now().timestamp():
            raise HTTPException(status_code=401, detail="Token expired")
        user_id = decodedToken.get("id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
                "id": user.id,
                "email": user.email,
                "username": user.username
                }
    except Exception as e:
        print(f"Error while authenticating user: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication Failed")
