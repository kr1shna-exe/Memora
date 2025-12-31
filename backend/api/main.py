import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.auth import router as auth_router
from api.routes.memory import router as memory_router
from api.routes.conversations import router as conversations_router

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins = ["https://memora-lovat-delta.vercel.app", "https://memora.kr1shna.me","http://localhost:3000"],
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"]
        )

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(memory_router, prefix="/api/memory", tags=["memory"])
app.include_router(conversations_router, prefix="/api/conversations", tags=["conversations"])

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="127.0.0.1", port=8000, reload=True)
