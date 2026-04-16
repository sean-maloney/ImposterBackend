import { createRoom, getRoom, addPlayer, saveGameData, addScore } from '../models/roomModel.js';
import { buildGameData } from './gameController.js';

export function handleCreateRoom(req, res) {
  const { hostName, selectedCategories, rules } = req.body;
  const code = createRoom(hostName, selectedCategories, rules);
  res.json({ code });
}

export function handleJoinRoom(req, res) {
  const { code, playerName } = req.body;
  const room = getRoom(code);

  if (!room) {
    return res.status(404).json({ detail: 'Room not found' });
  }

  addPlayer(code, playerName);
  res.json({
    players: room.players,
    selectedCategories: room.selectedCategories,
    rules: room.rules,
  });
}

export function handleGetRoom(req, res) {
  const { code } = req.params;
  const room = getRoom(code);

  if (!room) {
    return res.status(404).json({ detail: 'Room not found' });
  }

  res.json(room);
}

export async function handleStartRoom(req, res) {
  const { code } = req.params;
  const room = getRoom(code);

  if (!room) {
    return res.status(404).json({ detail: 'Room not found' });
  }

  const gameData = await buildGameData(room.players, room.selectedCategories, room.rules);
  saveGameData(code, gameData);
  res.json(gameData);
}

export function handleSubmitScore(req, res) {
  const { code, playerName, points } = req.body;
  const room = getRoom(code);

  if (!room) {
    return res.status(404).json({ detail: 'Room not found' });
  }

  addScore(code, playerName, points);
  res.json({ scores: room.scores });
}
