import uvicorn
from fastapi import Fastapi
from api.routes.auth import router as auth_router

app = Fastapi()
app.include(auth_router, prefix=["/api/auth"], tags=["auth"])

if __init__ = __name__:
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
