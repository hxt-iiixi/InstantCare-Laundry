// routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, (req, res) => {
  res.status(200).json({ message: 'User profile', user: req.user });
});

export default router;
