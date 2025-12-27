from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from exports.sql_init import db_session
from controllers.conversations import get_user_conversations

router = APIRouter()

@router.get("")
def list_conversations(request: Request, db: Session = Depends(db_session)):
    conversations = get_user_conversations(request, db)
    return { "conversations" : conversations}
