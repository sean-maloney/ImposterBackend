import crypto from 'crypto';
import { getDB } from '../database.js';

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function findUserByEmail(email) {
  const db = getDB();
  return await db.collection('users').findOne({ email });
}

export async function findUserByCredentials(email, password) {
  const db = getDB();
  return await db.collection('users').findOne({
    email,
    password_hash: hashPassword(password)
  });
}

export async function createUser(name, email, password) {
  const db = getDB();
  await db.collection('users').insertOne({
    name,
    email,
    password_hash: hashPassword(password)
  });
}
