from exports.sql_init import db_session
from exports.types import RegisterSchema, LoginSchema
from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from api.controllers.auth import create_user, get_current_user, get_user, create_token

router = APIRouter()

@router.post("/register")
def signup(user_data: RegisterSchema, response: Response, db: Session = Depends(db_session)):
    new_user = create_user(user_data, db)
    token = create_token(new_user)
    response.set_cookie(
        key="token",
        value=token,
        max_age=86400,
        httponly=True,
        samesite="none",
        secure=True
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
def signin(user_data: LoginSchema, response: Response, db: Session = Depends(db_session)):
    user = get_user(user_data, db)
    token = create_token(user)
    response.set_cookie(
        key="token",
        value=token,
        max_age=86400,
        httponly=True,
        samesite="none",
        secure=True
    )
    return {
        "message": "User logged in succesfully",
        "token": token,
        "user": {
            "username": user.username,
            "email": user.email
        }
    }

@router.post("/logout")
def signout(response: Response):
    try:
        response.delete_cookie("token")
        return {"message": "Logged out"}
    except Exception as e:
        print(f"Error while logging out: {str(e)}")

@router.get("/me")
def get_me(request: Request, db: Session = Depends(db_session)):
    user = get_current_user(request, db)
    return {
            "user": user
            }
