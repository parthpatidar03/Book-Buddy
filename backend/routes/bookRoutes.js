import express from 'express';
import { getBooks, createBook, getBookById, deleteBook } from '../controllers/bookController.js';
import { searchExternalBooks } from '../controllers/externalBookController.js';
import auth from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', auth, admin, createBook); // Protected: Only for admins
router.delete('/:id', auth, admin, deleteBook); // Protected: Only for admins
router.get('/external', searchExternalBooks); // NEW: External API route
router.get('/:id', getBookById);

export default router;

