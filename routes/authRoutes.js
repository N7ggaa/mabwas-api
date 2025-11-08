import express from 'express';
import passport from 'passport'; // Import passport
import { signup, login, forgotPassword, resetPassword, socialAuthCallback, getMe, deleteAccount } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.delete('/account', protect, deleteAccount);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), socialAuthCallback);

// Apple OAuth routes
router.get('/apple', passport.authenticate('apple'));
router.post('/apple/callback', passport.authenticate('apple', { failureRedirect: '/login' }), socialAuthCallback);

export default router;