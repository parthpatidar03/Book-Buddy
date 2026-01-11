import express from 'express';
import { signup, login } from '../controllers/authController.js';

import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// GET /api/auth/google
// Triggers the Google Login Popup
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback
// Google redirects back here with the "code"
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Successful authentication, user is in req.user

        // Generate JWT (Same logic as login controller)
        const token = jwt.sign(
            { userId: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Sanitize user (remove sensitive data if any, though model doesn't return password usually)
        const userJson = JSON.stringify({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            avatar: req.user.avatar
        });

        // Redirect to Frontend with Token
        // We pass the token in the URL params so the frontend can read it
        const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientURL}/login?token=${token}&user=${encodeURIComponent(userJson)}`);
    }
);

export default router;

