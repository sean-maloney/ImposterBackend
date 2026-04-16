import express from 'express';
import { buildGameData } from '../controllers/gameController.js';
import { getWordsByCategory } from '../models/wordModel.js';

const router = express.Router();

router.post('/game/start', async (req, res) => {
  const { players, selectedCategories, rules } = req.body;
  const gameData = await buildGameData(players, selectedCategories, rules);
  res.json(gameData);
});

router.get('/words/:category', async (req, res) => {
  const { category } = req.params;
  const words = await getWordsByCategory(category);

  if (!words || words.length === 0) {
    return res.status(404).json({ detail: 'Category not found' });
  }

  res.json(words.map(w => ({ word: w.word, hint: w.hint })));
});

export default router;
