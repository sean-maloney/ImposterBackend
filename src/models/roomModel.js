import crypto from 'crypto';

const rooms = {};

export function generateRoomCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export function createRoom(hostName, selectedCategories, rules) {
  const code = generateRoomCode();
  rooms[code] = {
    players: [hostName],
    selectedCategories,
    rules,
    gameData: null,
    scores: { [hostName]: 0 },
  };
  return code;
}

export function getRoom(code) {
  return rooms[code.toUpperCase()];
}

export function addPlayer(code, playerName) {
  const room = getRoom(code);
  if (room && !room.players.includes(playerName)) {
    room.players.push(playerName);
    room.scores[playerName] = 0;
  }
}

export function saveGameData(code, gameData) {
  const room = getRoom(code);
  if (room) {
    room.gameData = gameData;
  }
}

export function addScore(code, playerName, points) {
  const room = getRoom(code);
  if (room) {
    room.scores[playerName] = (room.scores[playerName] || 0) + points;
  }
}
