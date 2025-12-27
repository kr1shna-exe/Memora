from sqlalchemy.orm import Session
from fastapi import HTTPException, Request
from db.models.user import Conversation, Message
from api.controllers.auth import get_current_user

def get_user_conversations(request: Request, db: Session):
    user = get_current_user(request, db)
    conversations = db.query(Conversation).filter(Conversation.user_id == user["id"]).order_by(Conversation.updated_at.desc()).all()
    return [
            {
                "id": conv.id,
                "title": conv.title,
                "updated_at": conv.updated_at
                }
            for conv in conversations
            ]
