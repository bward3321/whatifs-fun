from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class ScoreSubmit(BaseModel):
    player_name: str = "Anonymous"
    mode: str
    score: int
    longest_streak: int = 0
    survival_time: float = 0.0
    max_speed: float = 1.0


class ScoreResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    player_name: str
    mode: str
    score: int
    longest_streak: int
    survival_time: float
    max_speed: float
    created_at: str


class GlobalStats(BaseModel):
    total_games: int
    avg_survival_time: float
    avg_score: float
    top_score: int


@api_router.get("/")
async def root():
    return {"message": "Too Fast To Click API"}


@api_router.post("/scores", response_model=ScoreResponse)
async def submit_score(score_data: ScoreSubmit):
    doc = {
        "id": str(uuid.uuid4()),
        "player_name": score_data.player_name,
        "mode": score_data.mode,
        "score": score_data.score,
        "longest_streak": score_data.longest_streak,
        "survival_time": score_data.survival_time,
        "max_speed": score_data.max_speed,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.scores.insert_one(doc)
    return ScoreResponse(**{k: v for k, v in doc.items() if k != '_id'})


@api_router.get("/scores/leaderboard", response_model=List[ScoreResponse])
async def get_leaderboard(mode: str = "classic", limit: int = 10):
    scores = await db.scores.find(
        {"mode": mode}, {"_id": 0}
    ).sort("score", -1).limit(limit).to_list(limit)
    return scores


@api_router.get("/scores/stats", response_model=GlobalStats)
async def get_global_stats():
    pipeline = [
        {"$group": {
            "_id": None,
            "total_games": {"$sum": 1},
            "avg_survival_time": {"$avg": "$survival_time"},
            "avg_score": {"$avg": "$score"},
            "top_score": {"$max": "$score"}
        }}
    ]
    result = await db.scores.aggregate(pipeline).to_list(1)
    if result:
        return GlobalStats(
            total_games=result[0]["total_games"],
            avg_survival_time=round(result[0]["avg_survival_time"], 1),
            avg_score=round(result[0]["avg_score"], 1),
            top_score=result[0]["top_score"]
        )
    return GlobalStats(total_games=0, avg_survival_time=27.0, avg_score=15, top_score=0)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
