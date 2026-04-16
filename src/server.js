import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import { seedWords } from './models/wordModel.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', gameRoutes);
app.use('/room', roomRoutes);

async function startServer() {
  await connectDB();
  await seedWords();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
