import uvicorn
from fastapi import FastAPI
from api.routes.auth import router as auth_router

app = FastAPI()
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
