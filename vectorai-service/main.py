import os
import hashlib
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
from cortex import CortexClient, DistanceMetric

app = FastAPI(title="DataFables VectorAI Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

COLLECTION = "failed_words"
DIMENSION = 768  # Gemini text-embedding-004 dimension
VECTORAI_HOST = os.getenv("VECTORAI_HOST", "vectorai-db:50051")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

genai.configure(api_key=GEMINI_API_KEY)


def get_client() -> CortexClient:
    return CortexClient(VECTORAI_HOST)


def get_embedding(text: str) -> list[float]:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
    )
    return result["embedding"]


def word_id(word: str, language: str) -> int:
    h = hashlib.sha256(f"{word.lower()}:{language.lower()}".encode()).hexdigest()
    return int(h[:15], 16)


@app.on_event("startup")
def startup():
    for attempt in range(5):
        try:
            client = get_client()
            if not client.has_collection(COLLECTION):
                client.create_collection(COLLECTION, DIMENSION, DistanceMetric.COSINE)
            print(f"Connected to VectorAI DB, collection '{COLLECTION}' ready.")
            return
        except Exception as e:
            print(f"VectorAI DB not ready (attempt {attempt+1}/5): {e}")
            time.sleep(3)
    print("Warning: Could not connect to VectorAI DB on startup. Will retry on first request.")


class StoreWordRequest(BaseModel):
    word: str
    definition: str = ""
    language: str = "English"
    age_group: str = "8-10"


class PracticeWordsRequest(BaseModel):
    topic: str
    language: str = "English"
    top_k: int = 5


@app.post("/store-word")
def store_word(req: StoreWordRequest):
    try:
        text_for_embedding = f"{req.word}: {req.definition}" if req.definition else req.word
        embedding = get_embedding(text_for_embedding)

        client = get_client()
        if not client.has_collection(COLLECTION):
            client.create_collection(COLLECTION, DIMENSION, DistanceMetric.COSINE)

        wid = word_id(req.word, req.language)
        client.upsert(
            COLLECTION,
            id=wid,
            vector=embedding,
            payload={
                "word": req.word,
                "definition": req.definition,
                "language": req.language,
                "age_group": req.age_group,
                "stored_at": time.time(),
            },
        )
        return {"status": "stored", "word": req.word, "id": wid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-practice-words")
def get_practice_words(req: PracticeWordsRequest):
    try:
        client = get_client()
        if not client.has_collection(COLLECTION):
            return []

        count = client.count(COLLECTION)
        if count == 0:
            return []

        embedding = get_embedding(req.topic)
        top_k = min(req.top_k, count)
        results = client.search(COLLECTION, query=embedding, top_k=top_k)

        words = []
        for r in results:
            if r.payload.get("language", "").lower() == req.language.lower():
                words.append({
                    "word": r.payload["word"],
                    "definition": r.payload.get("definition", ""),
                    "score": r.score,
                })
        return words
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    try:
        client = get_client()
        has = client.has_collection(COLLECTION)
        count = client.count(COLLECTION) if has else 0
        return {"status": "healthy", "collection_exists": has, "word_count": count}
    except Exception as e:
        return {"status": "degraded", "error": str(e)}
