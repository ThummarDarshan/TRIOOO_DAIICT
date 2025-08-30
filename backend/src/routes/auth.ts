import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticateToken, requireApprovedStatus } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, requireApprovedStatus, getProfile);
router.put('/profile', authenticateToken, requireApprovedStatus, updateProfile);

export default router;
