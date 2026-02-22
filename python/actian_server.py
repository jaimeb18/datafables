"""
Actian VectorAI DB proxy server for DataFables.
Exposes a simple REST API that Next.js calls.

Usage:
  1. Start Actian:    docker compose up -d
  2. Install deps:    pip install -r requirements.txt
  3. Run server:      python actian_server.py

The server runs on http://localhost:8001
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from cortex import CortexClient
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DataFables Actian VectorAI Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ACTIAN_HOST = "localhost:50051"
COLLECTION  = "datafables_stories"
DIMENSION   = 384  # all-MiniLM-L6-v2

# Load embedding model once at startup
logger.info("Loading sentence-transformer model...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
logger.info("Model loaded.")


def get_client():
    return CortexClient(ACTIAN_HOST)


def ensure_collection(client: CortexClient):
    if not client.has_collection(COLLECTION):
        client.create_collection(COLLECTION, dimension=DIMENSION)
        logger.info(f"Created collection '{COLLECTION}'")


# ── Request / response models ─────────────────────────────────────────────────

class StoreStoryRequest(BaseModel):
    id: str          # unique story id (e.g. timestamp)
    title: str
    topic: str
    age_group: str
    summary: str     # first page text as summary


class RecommendRequest(BaseModel):
    query: str       # current story title or summary text
    top_k: int = 4


class StorySuggestion(BaseModel):
    id: str
    title: str
    topic: str
    age_group: str
    score: float


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    try:
        with get_client() as client:
            client.health_check()
        return {"status": "ok", "actian": "connected"}
    except Exception as e:
        return {"status": "ok", "actian": f"unavailable: {e}"}


@app.post("/stories")
def store_story(req: StoreStoryRequest):
    """Embed and store a story in Actian VectorAI DB."""
    text = f"{req.title}. {req.summary}"
    vector = embedder.encode(text).tolist()

    try:
        with get_client() as client:
            ensure_collection(client)
            client.upsert(
                COLLECTION,
                id=abs(hash(req.id)) % (10**9),  # Actian expects integer id
                vector=vector,
                payload={
                    "story_id": req.id,
                    "title": req.title,
                    "topic": req.topic,
                    "age_group": req.age_group,
                },
            )
            client.flush(COLLECTION)
        logger.info(f"Stored story '{req.title}' (id={req.id})")
        return {"success": True}
    except Exception as e:
        logger.error(f"Store error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommend", response_model=list[StorySuggestion])
def recommend(req: RecommendRequest):
    """Find similar stories using semantic vector search."""
    vector = embedder.encode(req.query).tolist()

    try:
        with get_client() as client:
            ensure_collection(client)
            count = client.count(COLLECTION)
            if count == 0:
                return []

            results = client.search(
                COLLECTION,
                query=vector,
                top_k=min(req.top_k + 1, count),  # +1 to exclude self
            )

        suggestions = []
        for r in results:
            payload = r.payload or {}
            # Skip if it's the exact same story
            if payload.get("story_id") == req.query:
                continue
            suggestions.append(StorySuggestion(
                id=payload.get("story_id", ""),
                title=payload.get("title", "Unknown Story"),
                topic=payload.get("topic", ""),
                age_group=payload.get("age_group", ""),
                score=round(float(r.score), 3),
            ))

        return suggestions[: req.top_k]
    except Exception as e:
        logger.error(f"Recommend error: {e}")
        return []  # fail gracefully — don't break the UI


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)
