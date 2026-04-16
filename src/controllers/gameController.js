import { getWordsByCategory, getFallbackWords } from '../models/wordModel.js';

export async function buildGameData(players, selectedCategories, rules) {
  const chosenCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];

  let words = await getWordsByCategory(chosenCategory);
  if (!words || words.length === 0) {
    words = getFallbackWords(chosenCategory);
  }

  const chosenWord = words[Math.floor(Math.random() * words.length)];

  const maxImposters = Math.max(1, Math.min(rules.maxImposters || 1, players.length - 1));
  const actualImposterCount = Math.floor(Math.random() * maxImposters) + 1;

  const shuffledIndexes = [...Array(players.length).keys()].sort(() => Math.random() - 0.5);
  const imposterIndexes = shuffledIndexes.slice(0, actualImposterCount);

  let recommendedOrder = [...players].sort(() => Math.random() - 0.5);

  if (rules.imposterCanGoFirst && imposterIndexes.length > 0) {
    const firstImposterName = players[imposterIndexes[0]];
    recommendedOrder = [firstImposterName, ...recommendedOrder.filter(p => p !== firstImposterName)];
  }

  return {
    category: chosenCategory,
    word: chosenWord.word,
    hint: chosenWord.hint,
    imposterIndexes,
    recommendedOrder,
  };
}
