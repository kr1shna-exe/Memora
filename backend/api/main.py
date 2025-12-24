import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.auth import router as auth_router
from api.routes.memory import router as memory_router

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins = ["http://localhost:3000"],
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"]
        )

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(memory_router, prefix="/api/memory", tags=["memory"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
