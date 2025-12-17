import jwt, os, bcrypt
from dotenv import load_dotenv
from fastapi import HTTPException, Request, Cookie
