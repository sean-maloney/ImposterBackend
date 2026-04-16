import express from 'express';
import {
  handleCreateRoom,
  handleJoinRoom,
  handleGetRoom,
  handleStartRoom,
  handleSubmitScore,
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/create', handleCreateRoom);
router.post('/join', handleJoinRoom);
router.post('/score', handleSubmitScore);

// Dynamic routes placed after fixed routes
router.get('/:code', handleGetRoom);
router.post('/:code/start', handleStartRoom);

export default router;
