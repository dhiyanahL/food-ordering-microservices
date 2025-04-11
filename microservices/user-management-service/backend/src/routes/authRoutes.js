import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  googleCallback,
  facebookCallback,
} from '../controllers/authController.js';

const router = express.Router();

//PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), facebookCallback);

export default router;
