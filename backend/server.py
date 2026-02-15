from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import random
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ Models ============

class Question(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    statement: str
    is_true: bool
    explanation: str
    category: str
    difficulty: int = Field(ge=1, le=4)
    confidence: float = Field(ge=0, le=1)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuestionRequest(BaseModel):
    category: str
    difficulty: str = "medium"  # chill, spicy, savage
    exclude_ids: List[str] = []

class GameSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    difficulty: str
    streak: int
    accuracy: float
    questions_answered: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameSessionCreate(BaseModel):
    category: str
    difficulty: str
    streak: int
    accuracy: float
    questions_answered: int

# Category definitions
CATEGORIES = {
    "animals": "Animals & Nature",
    "geography": "Geography & Earth",
    "history": "People & History",
    "food": "Food & Drink",
    "space": "Space & Science",
    "pop_culture": "Pop Culture & Tech"
}

DIFFICULTY_MAP = {
    "chill": [1, 2],
    "spicy": [2, 3],
    "savage": [3, 4]
}

# ============ LLM Integration ============

async def generate_question_with_llm(category: str, difficulty_range: List[int]) -> Optional[Question]:
    """Generate a trivia question using OpenAI GPT-5.2 via emergentintegrations"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            logger.error("EMERGENT_LLM_KEY not found")
            return None
        
        difficulty = random.choice(difficulty_range)
        category_name = CATEGORIES.get(category, category)
        
        system_prompt = """You are a trivia question generator for a game called "True or Totally Fake?"

RULES:
- Generate surprising, fun, slightly mind-bending facts
- NO obvious statements like "The sky is blue"
- NO trivial textbook facts
- NO trick wording or ambiguous claims
- NO niche obscure trivia
- NO controversial modern politics
- NO harmful content
- Statements should be clear and decisive
- Mix of TRUE and FALSE statements (roughly 50/50)

For FALSE statements:
- Make them sound plausible but be clearly false
- Don't make them too obviously wrong

OUTPUT FORMAT (JSON only, no markdown):
{
    "statement": "short punchy statement",
    "is_true": true or false,
    "explanation": "1-2 concise sentences explaining why",
    "confidence": 0.85 to 1.0
}"""

        user_prompt = f"""Generate a trivia statement for the category: {category_name}
Difficulty level: {difficulty}/4 (1=easy, 4=very hard)

Remember: Output ONLY valid JSON, no markdown code blocks or extra text."""

        chat = LlmChat(
            api_key=api_key,
            session_id=f"trivia-{uuid.uuid4()}",
            system_message=system_prompt
        ).with_model("openai", "gpt-5.2")
        
        response = await chat.send_message(UserMessage(text=user_prompt))
        
        # Parse the response
        response_text = response.strip()
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        data = json.loads(response_text)
        
        # Validate confidence threshold
        if data.get("confidence", 0) < 0.85:
            logger.warning("Low confidence question, regenerating...")
            return None
        
        question = Question(
            statement=data["statement"],
            is_true=data["is_true"],
            explanation=data["explanation"],
            category=category,
            difficulty=difficulty,
            confidence=data.get("confidence", 0.9)
        )
        
        return question
        
    except Exception as e:
        logger.error(f"Error generating question: {e}")
        return None

# ============ API Endpoints ============

@api_router.get("/")
async def root():
    return {"message": "True or Totally Fake API"}

@api_router.get("/categories")
async def get_categories():
    """Get all available categories"""
    return {
        "categories": [
            {"id": k, "name": v} for k, v in CATEGORIES.items()
        ]
    }

@api_router.post("/questions/generate", response_model=Question)
async def generate_question(request: QuestionRequest):
    """Generate a new question using LLM"""
    if request.category not in CATEGORIES and request.category != "mix":
        raise HTTPException(status_code=400, detail="Invalid category")
    
    # Choose category for mix
    category = request.category
    if category == "mix":
        category = random.choice(list(CATEGORIES.keys()))
    
    difficulty_range = DIFFICULTY_MAP.get(request.difficulty, [2, 3])
    
    # Try to get a cached question first (that hasn't been shown recently)
    cached = await db.questions.find_one({
        "category": category,
        "difficulty": {"$in": difficulty_range},
        "id": {"$nin": request.exclude_ids}
    }, {"_id": 0})
    
    if cached:
        # Convert timestamp if needed
        if isinstance(cached.get('created_at'), str):
            cached['created_at'] = datetime.fromisoformat(cached['created_at'])
        return Question(**cached)
    
    # Generate new question
    question = await generate_question_with_llm(category, difficulty_range)
    
    if not question:
        raise HTTPException(status_code=500, detail="Failed to generate question")
    
    # Cache the question
    doc = question.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.questions.insert_one(doc)
    
    return question

@api_router.get("/questions/batch")
async def get_question_batch(category: str = "mix", difficulty: str = "spicy", count: int = 5):
    """Get a batch of questions for prefetching"""
    if category not in CATEGORIES and category != "mix":
        raise HTTPException(status_code=400, detail="Invalid category")
    
    questions = []
    difficulty_range = DIFFICULTY_MAP.get(difficulty, [2, 3])
    
    # Get cached questions
    query = {"difficulty": {"$in": difficulty_range}}
    if category != "mix":
        query["category"] = category
    
    cached = await db.questions.find(query, {"_id": 0}).limit(count).to_list(count)
    
    for q in cached:
        if isinstance(q.get('created_at'), str):
            q['created_at'] = datetime.fromisoformat(q['created_at'])
        questions.append(Question(**q))
    
    # If we need more, generate them
    while len(questions) < count:
        cat = category if category != "mix" else random.choice(list(CATEGORIES.keys()))
        q = await generate_question_with_llm(cat, difficulty_range)
        if q:
            questions.append(q)
            doc = q.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.questions.insert_one(doc)
    
    return {"questions": questions}

@api_router.post("/sessions", response_model=GameSession)
async def save_game_session(session: GameSessionCreate):
    """Save a game session/score"""
    game_session = GameSession(**session.model_dump())
    doc = game_session.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.sessions.insert_one(doc)
    return game_session

@api_router.get("/leaderboard")
async def get_leaderboard(category: str = None, limit: int = 10):
    """Get top scores"""
    query = {}
    if category and category != "all":
        query["category"] = category
    
    sessions = await db.sessions.find(query, {"_id": 0}).sort("streak", -1).limit(limit).to_list(limit)
    
    for s in sessions:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    
    return {"leaderboard": sessions}

@api_router.get("/stats")
async def get_stats():
    """Get game statistics"""
    total_questions = await db.questions.count_documents({})
    total_sessions = await db.sessions.count_documents({})
    
    # Get category distribution
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_counts = await db.questions.aggregate(pipeline).to_list(100)
    
    return {
        "total_questions": total_questions,
        "total_sessions": total_sessions,
        "questions_by_category": {item["_id"]: item["count"] for item in category_counts}
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
