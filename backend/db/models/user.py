from datetime import datetime
from typing import List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship, mapped_column, Mapped

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "Users"
    id: Mapped[int] = mapped_column(primary_key = True, autoincrement = True)
    email: Mapped[str] = mapped_column(unique = True)
    username: Mapped[str] = mapped_column(String(15), unique = True)
    password: Mapped[str]
    conversations: Mapped[List["Conversation"]] = relationship(back_populates="user")

class Conversation(Base):
    __tablename__ = "Conversations"
    id: Mapped[int] = mapped_column(primary_key = True, autoincrement = True)
    title: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now, onupdate=datetime.now)
    user_id: Mapped[int] = mapped_column(ForeignKey("Users.id"))
    user: Mapped[User] = relationship(back_populates="conversations")
    messages: Mapped[List["Message"]] = relationship(back_populates="conversation")

class Message(Base):
    __tablename__ = "Messages"
    id: Mapped[int] = mapped_column(primary_key = True, autoincrement = True)
    role: Mapped[str]
    content: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("Conversations.id"))
    conversation: Mapped[Conversation] = relationship(back_populates="messages")
