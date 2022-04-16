import express from 'express';
import authMiddleware from '../middleware/auth';

// eslint-disable-next-line prettier/prettier
import {
  register,
  login,
  refreshTokenHandler,
  logout
} from '../controllers/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshTokenHandler);
router.post('/logout', authMiddleware, logout);

export default router;
