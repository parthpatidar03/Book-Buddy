import express from 'express';
import { getBookSummary } from '../controllers/summaryController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, getBookSummary);

export default router;
