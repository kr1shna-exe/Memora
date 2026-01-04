# Memora

An AI-powered Agentic Memory Engine that learns from your conversations, extracts and stores memories, and uses them to provide personalized, context-aware assistance. Memora combines vector databases, procedural learning, and intelligent memory retrieval to extend your mind.

## Overview

Memora is an intelligent personal assistant that remembers everything about you by leveraging:

- **Multi-Memory System**: Three distinct memory types (episodic, semantic, procedural) for comprehensive understanding
- **Vector Database**: Semantic search and retrieval using Qdrant vector storage
- **Pattern Detection**: Learns your communication style, preferences, and behavioral patterns
- **Memory-Augmented Generation**: Contextualizes responses with your personal history

## Key Features

### Intelligent Memory Extraction

- **Automatic Extraction**: Learns from conversations without manual input
- **Memory Classification**: Distinguishes between episodic (time-based) and semantic (knowledge) memories
- **Vector Embeddings**: Enables semantic similarity search across your memory base

### Three-Tier Memory Architecture

- **Episodic Memory**: Time-based retrieval with recency scoring
- **Semantic Memory**: Knowledge facts and preferences via vector similarity
- **Procedural Memory**: Pattern detection, communication style analysis, and preference learning

### Personalized AI Assistance

- **Context-Aware Responses**: Draws from your personal memory during conversations
- **Communication Adaptation**: Adjusts responses based on your detected preferences
- **Streaming Responses**: Real-time response streaming for better UX

### User Experience

- **Modern Chat Interface**: Clean, responsive Next.js frontend
- **Memory Browser**: View, search, and manage your extracted memories
- **Conversation History**: Full conversation management with persistence

## Architecture

### System Architecture

The system follows a memory-augmented conversational architecture:

```
User Message → Memory Agent → Vector DB Query
                    ↓              ↓
              Relevant Memories  [Qdrant]
                    ↓          (memories collection)
              Context Builder
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
Episodic        Semantic        Procedural
 Memory          Memory           Memory
    ↓               ↓               ↓
    └───────────────┼───────────────┘
                    ↓
              LLM Orchestrator
                    ↓
           Streaming Response
                    ↓
          Memory Extraction ──→ Vector DB Storage
```

### Memory System Workflow

1. **Memory Agent** (Entry Point)
   - Retrieves relevant memories based on conversation context
   - Uses tools: `get_recent_memories`, `search_memories_with_recency`
   - Applies recency scoring (newer memories weighted higher)

2. **Procedural Analysis** (Pattern Detection)
   - Triggers every 5 conversations
   - Analyzes communication preferences
   - Detects behavioral patterns and preferences
   - Stores insights for response personalization

3. **Response Generation**
   - Combines conversation history with retrieved memories
   - Applies user communication preferences
   - Streams response via Server-Sent Events (SSE)

4. **Memory Extraction** (Post-Conversation)
   - Extracts key facts from conversation
   - Classifies as episodic or semantic
   - Generates embeddings and stores in vector DB

### Database Architecture

Memora uses a dual-database approach:

| Database   | Purpose              | Content                                    |
| ---------- | -------------------- | ------------------------------------------ |
| PostgreSQL | Relational Data      | Users, Conversations, Messages, Patterns   |
| Qdrant     | Vector Storage       | Memory embeddings with semantic search     |

## Technology Stack

### Backend

| Category            | Technologies                            |
| ------------------- | --------------------------------------- |
| **Framework**       | FastAPI, Uvicorn                        |
| **Language**        | Python 3.10+                            |
| **AI/ML**           | LangChain, Google Gemini, OpenAI, Groq  |
| **Vector Database** | Qdrant                                  |
| **SQL Database**    | PostgreSQL 14+, SQLAlchemy 2.0          |
| **Embedding Model** | Google text-embedding (768D)            |
| **Authentication**  | JWT, bcrypt                             |
| **Package Manager** | uv (ultra-fast Python package manager)  |

### Frontend

| Category       | Technologies         |
| -------------- | -------------------- |
| **Framework**  | Next.js 16, React 19 |
| **Styling**    | Tailwind CSS 4       |
| **Animations** | Framer Motion        |
| **Language**   | TypeScript 5         |
| **HTTP**       | Axios                |

## How It Works

### 1. User Authentication

```python
# Secure registration with validation
POST /api/auth/register

# JWT-based login with httpOnly cookies
POST /api/auth/login
```

### 2. Conversation Processing

- Messages stored in PostgreSQL
- Memory Agent queries relevant context
- LLM generates response with personalization
- Response streamed via SSE

### 3. Memory Extraction

```python
# For each conversation:
memories = extract_memories(conversation)

# Classify and embed
for memory in memories:
    embedding = generate_embedding(memory.content)
    store_to_qdrant(memory, embedding)
```

### 4. Pattern Detection

```python
# Every 5 conversations:
patterns = procedural_memory.analyze_patterns(user_id)

# Stores: communication preferences, engagement patterns
user.patterns_json = patterns.to_json()
```

### 5. Memory-Augmented Response

```python
# Query relevant memories
memories = memory_agent.get_relevant_memories(query)

# Build context with user patterns
context = {
    "conversation_history": messages,
    "relevant_memories": memories,
    "user_preferences": user.patterns
}

# Generate personalized response
response = llm.generate(context)
```

## Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 20+
- PostgreSQL 14+
- Qdrant (vector database)

### Backend Setup (Docker - Recommended)

```bash
# Navigate to backend directory
cd backend

# Create .env file with required variables
cat > .env << EOF
DB_USERNAME=postgres
DB_PASS=your_password
DB_HOST=postgres
DB_PORT=5432
DB_NAME=memora
JWT_SECRET=your_jwt_secret
QDRANT_URL=http://qdrant:6333
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
EOF

# Start all services (PostgreSQL, Qdrant, Backend)
docker-compose up -d
```

The server will:

1. Initialize PostgreSQL database with users, conversations, messages tables
2. Connect to Qdrant vector database
3. Load embedding model (Google text-embedding 768D)
4. Start FastAPI server on port 8000

### Backend Setup (Local Development)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies with uv
uv sync

# Start PostgreSQL and Qdrant locally
# Then run the server
uv run python api/main.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Create environment file
cat > .env << EOF
NEXT_PUBLIC_ENV=http://localhost:8000/api
EOF

# Install dependencies
npm install

# Run development server
npm run dev
```

Access the application at `http://localhost:3000`

## Configuration

### Environment Variables

**Backend** (`backend/.env`):

```env
# Database
DB_USERNAME=<username>
DB_PASS=<password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=<name>

# Security
JWT_SECRET=<your_secret_key>

# Vector Database
QDRANT_URL=http://localhost:6333

# AI APIs (at least one required)
GEMINI_API_KEY=<gemini_key>
OPENAI_API_KEY=<openai_key>    
GROQ_API_KEY=<groq_key>        
```

**Frontend** (`frontend/.env`):

```env
NEXT_PUBLIC_ENV=http://localhost:8000/api
```

## Project Structure

```
Memora/
├── backend/
│   ├── api/                        # API layer
│   │   ├── routes/                # Endpoint definitions
│   │   │   ├── auth.py           # Authentication endpoints
│   │   │   ├── conversations.py  # Conversation management
│   │   │   └── memory.py         # Memory endpoints
│   │   ├── controllers/          # Business logic
│   │   └── main.py               # FastAPI application
│   ├── memory/                    # Memory systems
│   │   ├── episodic_mem.py       # Time-based memory
│   │   ├── procedural_mem.py     # Pattern detection
│   │   └── memory_manager.py     # Memory coordination
│   ├── agents/                    # AI agents
│   │   └── memory_agent.py       # Memory retrieval agent
│   ├── llm/                       # LLM integration
│   │   ├── orchestrator.py       # Provider coordination
│   │   ├── providers.py          # LLM clients
│   │   └── prompts.py            # System prompts
│   ├── storage/                   # Data storage
│   │   ├── memory_store.py       # Memory CRUD
│   │   └── vector_store.py       # Qdrant interface
│   ├── db/                        # Database
│   │   └── models/user.py        # SQLAlchemy models
│   ├── utils/                     # Utilities
│   │   ├── embeddings.py         # Embedding generation
│   │   └── extractor.py          # Memory extraction
│   ├── exports/                   # Shared types
│   ├── pyproject.toml            # Python dependencies
│   ├── Dockerfile                # Container definition
│   └── docker-compose.yml        # Docker orchestration
│
└── frontend/
    ├── app/                       # Next.js app router
    │   ├── (auth)/               # Auth pages (login, register)
    │   ├── dashboard/            # Protected routes
    │   │   ├── page.tsx          # Chat interface
    │   │   ├── memories/         # Memory browser
    │   │   └── settings/         # User settings
    │   ├── layout.tsx            # Root layout
    │   └── page.tsx              # Landing page
    ├── components/               # React components
    ├── context/                  # React context (Auth)
    ├── lib/                      # Frontend utilities
    │   ├── api/                  # API client modules
    │   └── utils.ts              # Utility functions
    ├── public/                   # Static assets
    └── package.json              # Node dependencies
```

## Development Workflow

### Backend

```bash
cd backend
uv run python api/main.py

# Run with Docker
docker-compose up --build
```

### Frontend

```bash
cd frontend
npm run build        
npm run dev          
```

## Why Memora?

### Traditional AI Assistant Problems

- No memory of past conversations
- Generic, one-size-fits-all responses
- Missing personal context
- Starting from scratch every session

### Memora Solutions

- Persistent memory across all conversations
- Personalized responses based on your patterns
- Rich context from your personal history
- Continuous learning and adaptation

---
