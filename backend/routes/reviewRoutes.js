import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createOrUpdateReview,
  getReviewsForBook,
  getUserReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', auth, createOrUpdateReview);
router.get('/book/:bookId', getReviewsForBook);
router.get('/user', auth, getUserReviews);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

export default router;