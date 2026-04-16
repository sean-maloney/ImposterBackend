import { getDB } from '../database.js';

export const WORD_DATA = {
  Animals: [
    { word: 'Lion', hint: 'Big Cat' },
    { word: 'Elephant', hint: 'Large Mammal' },
    { word: 'Penguin', hint: 'Bird' },
    { word: 'Shark', hint: 'Sea Animal' },
  ],
  Food: [
    { word: 'Pizza', hint: 'Fast Food' },
    { word: 'Burger', hint: 'Meal' },
    { word: 'Apple', hint: 'Fruit' },
    { word: 'Pasta', hint: 'Italian Food' },
  ],
  Movies: [
    { word: 'Titanic', hint: 'Romance Film' },
    { word: 'Shrek', hint: 'Animated Movie' },
    { word: 'Jaws', hint: 'Shark Film' },
    { word: 'Frozen', hint: 'Disney Movie' },
  ],
  Countries: [
    { word: 'Ireland', hint: 'European Country' },
    { word: 'Japan', hint: 'Asian Country' },
    { word: 'Brazil', hint: 'South American Country' },
    { word: 'Canada', hint: 'North American Country' },
  ],
  Random: [
    { word: 'Laptop', hint: 'Technology' },
    { word: 'Football', hint: 'Sport' },
    { word: 'Castle', hint: 'Building' },
    { word: 'Rainbow', hint: 'Nature' },
  ],
};

export async function seedWords() {
  const db = getDB();
  for (const [category, items] of Object.entries(WORD_DATA)) {
    const existing = await db.collection('words').findOne({ category });
    if (!existing) {
      for (const item of items) {
        await db.collection('words').insertOne({
          category,
          word: item.word,
          hint: item.hint,
        });
      }
    }
  }
}

export async function getWordsByCategory(category) {
  const db = getDB();
  return await db.collection('words').find({ category }).toArray();
}

export function getFallbackWords(category) {
  return WORD_DATA[category] || WORD_DATA.Random;
}
