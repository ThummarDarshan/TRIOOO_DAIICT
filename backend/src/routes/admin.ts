import { Router } from 'express';
import {
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  suspendUser,
  reactivateUser,
  updateUserRole
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/pending', getPendingUsers);

// User approval routes
router.post('/users/:userId/approve', approveUser);
router.post('/users/:userId/reject', rejectUser);

// User status management routes
router.post('/users/:userId/suspend', suspendUser);
router.post('/users/:userId/reactivate', reactivateUser);

// User role management routes
router.put('/users/:userId/role', updateUserRole);

export default router;
