import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', auth, getAnalytics);

export default router;
