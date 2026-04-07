from dotenv import load_dotenv
from fastapi import FastAPI

from .db import DB
from .dbcollections import WordsCollection

load_dotenv()


app = FastAPI()
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
    for item in items:
        db.write_collection(WordsCollection(category, item["word"], item["hint"]))
