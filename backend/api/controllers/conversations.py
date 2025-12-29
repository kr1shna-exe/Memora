from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, Request
from agents import MemoryAgent
from db.models.user import Conversation, Message, User
from api.controllers.auth import get_current_user
from exports.types import ConversationCreate, MessageCreate
from llm.orchestrator import LLMOrchestrator
from llm.prompts import MEMORY_ANSWER_PROMPT
from memory.memory_manager import MemoryManager
from memory.procedural_mem import ProceduralMemory
import json

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

def create_conversation(request: Request, data: ConversationCreate, db: Session):
    user = get_current_user(request, db)
    conversation = Conversation(
            title = data.title,
            user_id = user["id"]
            )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return {
            "id": conversation.id,
            "title": conversation.title,
            "updated_at": conversation.created_at.isoformat()
            }

def get_conversation_with_messages(request: Request, conversation_id: int, db: Session):
    user = get_current_user(request, db)
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user["id"]).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
                }
            for msg in conversation.messages
            ]
    return {
            "id": conversation.id,
            "title": conversation.title,
            "messages": messages
            }

def delete_conversation(request: Request, conversation_id: int, db: Session):
    user = get_current_user(request, db)
    conversation = db.query(Conversation).filter(Conversation.user_id == user["id"], Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conversation)
    db.commit()
    return { "message": "Conversation deleted"}

def _get_patterns_context(user_obj: User) -> str:
    if not user_obj.patterns_json:
        return ""
    try:
        patterns_data = json.loads(user_obj.patterns_json)
        patterns = patterns_data.get("patterns", {})
        guidelines = patterns.get("response_guidelines", [])
        if not guidelines:
            return ""
        return "User communication preferences:\n" + "\n".join(f"- {g}" for g in guidelines)
    except:
        return ""

async def _maybe_update_patterns(user_obj: User, current_conversation_id: int, db: Session):
    try:
        analyzed_up_to = 0
        if user_obj.patterns_json:
            patterns_data = json.loads(user_obj.patterns_json)
            analyzed_up_to = patterns_data.get("analyzed_up_to_conversation_id", 0)

        if (current_conversation_id - analyzed_up_to) >= 5:
            recent_conversations = db.query(Conversation).filter(
                Conversation.user_id == user_obj.id
            ).order_by(Conversation.updated_at.desc()).limit(5).all()

            procedural = ProceduralMemory()
            new_patterns = await procedural.analyze_from_raw_conversations(
                recent_conversations,
                current_conversation_id
            )
            user_obj.patterns_json = json.dumps(new_patterns)
            db.commit()
            print(f"Updated patterns for user {user_obj.id}")
    except Exception as e:
        print(f"Pattern update failed: {str(e)}")

async def send_message(request: Request, conversation_id: int, data: MessageCreate, db: Session):
    user = get_current_user(request, db)
    user_obj = db.query(User).filter(User.id == user["id"]).first()
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user["id"]).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    user_message = Message(
            role="user",
            content=data.content,
            conversation_id=conversation_id
            )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    history = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.desc()).limit(4).all()
    history = list(reversed(history))
    history_txt = ""
    for msg in history[:-1]:
        role = "User" if msg.role == "user" else "Assistant"
        history_txt += f"{role}: {msg.content}\n"
    user_id = str(user["id"])
    query_with_context = f"Recent conversation:\n{history_txt}\n\nCurrent query: {data.content}"
    memory_agent = MemoryAgent()
    memory_txt = await memory_agent.query(query_with_context, user_id)

    patterns_context = _get_patterns_context(user_obj)

    prompt = f"""{MEMORY_ANSWER_PROMPT}

    {memory_txt}

    {patterns_context}

    Conversation history:
    {history_txt}

    User: {data.content}

    Provide a helpful, personalized response based on the memories and conversation context.
    """
    llm_orchestrator = LLMOrchestrator()
    assistant_content = await llm_orchestrator.ai_invoke(prompt)

    assistant_message = Message(
            role="assistant",
            content=assistant_content,
            conversation_id=conversation_id
            )
    db.add(assistant_message)
    conversation.updated_at = datetime.now()
    db.commit()
    db.refresh(assistant_message)
    try:
        memory_manager = MemoryManager()
        message_for_extraction = [
                {"role": "user", "content": data.content},
                {"role": "assistant", "content": assistant_content}
                ]
        await memory_manager.add_conversation(message_for_extraction, user_id)
    except Exception as e:
        print(f"Memory Extraction Failed: {str(e)}")

    await _maybe_update_patterns(user_obj, conversation_id, db)

    return {
        "user_message": {
            "id": user_message.id,
            "role": user_message.role,
            "content": user_message.content,
            "created_at": user_message.created_at.isoformat()
        },
        "assistant_message": {
            "id": assistant_message.id,
            "role": assistant_message.role,
            "content": assistant_message.content,
            "created_at": assistant_message.created_at.isoformat()
        }
    }
