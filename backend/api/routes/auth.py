from exports.sql_init import db_session
from exports.types import UserSchema
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from controllers.auth import create_user, get_user, verify_password, create_token, authenticate_user

router = APIRouter()

@router.post("/register")
def signup(user_data: UserSchema, response: Response, db: Session = Depends(db_session)):
    new_user = create_user(user_data, db)
    token = create_token(new_user)
    response.set_cookie(
        key="token",
        value=token,
        max_age=86400,
        httpOnly=True,
        samesite="lax"
    )
    return {
        "message": "User successfully registered",
        "token": token,
        "user": {
            "username": new_user.username,
            "email": new_user.email
        }
    }

@router.post("/login")
def signin(user_data: UserSchema, response: Response, db: Session = Depends(db_session)):
    user = get_user(user_data, db)
    token = create_token(user)
    response.set_cookie(
        key="token",
        value=token,
        max_age=86400,
        httpOnly=True,
        samesite="lax"
    )
    return {
        "message": "User logged in succesfully",
        "token": token,
        "user": {
            "username": user.username,
            "email": user.email
        }
    }
