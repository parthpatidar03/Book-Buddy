import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  getReadingList,
  addToReadingList,
  updateReadingStatus,
  removeFromReadingList,
  updateProgress,
  addNote,
  exportReadingList
} from '../controllers/readingListController.js';

const router = express.Router();

router.get('/', auth, getReadingList);
router.post('/', auth, addToReadingList);
router.put('/:id', auth, updateReadingStatus);
router.delete('/:id', auth, removeFromReadingList);
router.put('/:id/progress', auth, updateProgress);
router.post('/:id/notes', auth, addNote);
router.get('/export', auth, exportReadingList);

export default router;

