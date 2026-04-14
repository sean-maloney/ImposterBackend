import os
import random
import hashlib
import secrets
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .db import DB
from .dbcollections import WordsCollection, UsersCollection

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

db = DB()

WORD_DATA = {
    "Animals": [
        {"word": "Lion", "hint": "Big Cat"},
        {"word": "Elephant", "hint": "Large Mammal"},
        {"word": "Penguin", "hint": "Bird"},
        {"word": "Shark", "hint": "Sea Animal"},
    ],
    "Food": [
        {"word": "Pizza", "hint": "Fast Food"},
        {"word": "Burger", "hint": "Meal"},
        {"word": "Apple", "hint": "Fruit"},
        {"word": "Pasta", "hint": "Italian Food"},
    ],
    "Movies": [
        {"word": "Titanic", "hint": "Romance Film"},
        {"word": "Shrek", "hint": "Animated Movie"},
        {"word": "Jaws", "hint": "Shark Film"},
        {"word": "Frozen", "hint": "Disney Movie"},
    ],
    "Countries": [
        {"word": "Ireland", "hint": "European Country"},
        {"word": "Japan", "hint": "Asian Country"},
        {"word": "Brazil", "hint": "South American Country"},
        {"word": "Canada", "hint": "North American Country"},
    ],
    "Random": [
        {"word": "Laptop", "hint": "Technology"},
        {"word": "Football", "hint": "Sport"},
        {"word": "Castle", "hint": "Building"},
        {"word": "Rainbow", "hint": "Nature"},
    ],
}

for category, items in WORD_DATA.items():
    existing = list(db.query_collection(WordsCollection, {"category": category}))
    if not existing:
        for item in items:
            db.write_collection(WordsCollection(category, item["word"], item["hint"]))


class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@app.post("/auth/signup")
def signup(body: SignUpRequest):
    existing = list(db.query_collection(UsersCollection, {"email": body.email}))
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db.write_collection(UsersCollection(body.name, body.email, hash_password(body.password)))
    token = secrets.token_hex(32)
    return {"token": token, "name": body.name, "email": body.email}


@app.post("/auth/login")
def login(body: LoginRequest):
    users = list(db.query_collection(UsersCollection, {"email": body.email, "password_hash": hash_password(body.password)}))
    if not users:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user = users[0]
    token = secrets.token_hex(32)
    return {"token": token, "name": user.get("name"), "email": user.get("email")}


@app.get("/words/{category}")
def get_words(category: str):
    words = list(db.query_collection(WordsCollection, {"category": category}))
    if not words:
        raise HTTPException(status_code=404, detail="Category not found")
    return [{"word": w["word"], "hint": w["hint"]} for w in words]


class GameStartRequest(BaseModel):
    players: List[str]
    selectedCategories: List[str]
    rules: dict

class GameStartResponse(BaseModel):
    category: str
    word: str
    hint: str
    imposterIndexes: List[int]
    recommendedOrder: List[str]


@app.post("/game/start", response_model=GameStartResponse)
def start_game(body: GameStartRequest):
    players = body.players
    rules = body.rules
    categories = body.selectedCategories

    chosen_category = random.choice(categories)
    words = list(db.query_collection(WordsCollection, {"category": chosen_category}))
    if not words:
        words = WORD_DATA.get(chosen_category, WORD_DATA["Random"])
    chosen_word = random.choice(words)

    max_imposters = max(1, min(rules.get("maxImposters", 1), len(players) - 1))
    actual_imposter_count = random.randint(1, max_imposters)

    shuffled_indexes = list(range(len(players)))
    random.shuffle(shuffled_indexes)
    imposter_indexes = shuffled_indexes[:actual_imposter_count]

    recommended_order = players[:]
    random.shuffle(recommended_order)

    if rules.get("imposterCanGoFirst", True) and imposter_indexes:
        first_imposter_name = players[imposter_indexes[0]]
        recommended_order = [first_imposter_name] + [p for p in recommended_order if p != first_imposter_name]

    return GameStartResponse(
        category=chosen_category,
        word=chosen_word["word"] if isinstance(chosen_word, dict) else chosen_word.get("word"),
        hint=chosen_word["hint"] if isinstance(chosen_word, dict) else chosen_word.get("hint"),
        imposterIndexes=imposter_indexes,
        recommendedOrder=recommended_order,
    )
