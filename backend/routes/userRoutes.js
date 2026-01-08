import express from 'express';
import { 
  updateReadingGoal, 
  updateProfile,
  followUser, 
  unfollowUser, 
  getUserProfile 
} from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.put('/goal', auth, updateReadingGoal);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.post('/follow/:id', auth, followUser);
router.post('/unfollow/:id', auth, unfollowUser);

// Public routes (but we might want auth to check if *we* are following them)
// For simplicity, let's make viewing profile public, but following requires auth
router.get('/profile/:id', getUserProfile);

export default router;
