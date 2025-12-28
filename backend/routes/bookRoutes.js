import express from 'express';
import { getBooks, createBook, getBookById } from '../controllers/bookController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', auth, createBook); // Protected: Only for admins or seeds
router.get('/:id', getBookById);

export default router;

