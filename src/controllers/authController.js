import crypto from 'crypto';
import { findUserByEmail, findUserByCredentials, createUser } from '../models/userModel.js';

export async function signup(req, res) {
  const { name, email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ detail: 'Email already registered' });
  }

  await createUser(name, email, password);
  const token = crypto.randomBytes(32).toString('hex');
  res.json({ token, name, email });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await findUserByCredentials(email, password);
  if (!user) {
    return res.status(401).json({ detail: 'Invalid email or password' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  res.json({ token, name: user.name, email: user.email });
}
