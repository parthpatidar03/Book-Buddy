import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  getCustomLists,
  createCustomList,
  updateCustomList,
  deleteCustomList
} from '../controllers/customListController.js';

const router = express.Router();

router.get('/', auth, getCustomLists);
router.post('/', auth, createCustomList);
router.put('/:id', auth, updateCustomList);
router.delete('/:id', auth, deleteCustomList);

export default router;