from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from exports.sql_init import db_session
from api.controllers.conversations import create_conversation, delete_conversation, get_conversation_with_messages, get_user_conversations, send_message, send_message_stream
from exports.types import ConversationCreate, MessageCreate

router = APIRouter()

@router.get("")
def list_conversations(request: Request, db: Session = Depends(db_session)):
    conversations = get_user_conversations(request, db)
    return { "conversations" : conversations}

@router.post("")
def new_conversation(request: Request, data: ConversationCreate, db: Session = Depends(db_session)):
    conversation = create_conversation(request, data, db)
    return conversation

@router.get("/{conversation_id}")
def get_converstaion(request: Request, conversation_id: int, db: Session = Depends(db_session)):
    return get_conversation_with_messages(request, conversation_id, db)

@router.delete("/{conversation_id}")
def remove_conversation(request: Request, conversation_id: int, db: Session = Depends(db_session)):
    return delete_conversation(request, conversation_id, db)

@router.post("/{conversation_id}/messages")
async def add_message(conversation_id: int, data: MessageCreate, request: Request, db: Session = Depends(db_session)):
    return await send_message(request, conversation_id, data, db)

@router.post("/{conversation_id}/messages/stream")
async def stream_message(conversation_id: int, data: MessageCreate, request: Request, db: Session = Depends(db_session)):
    return await send_message_stream(request, conversation_id, data, db)
