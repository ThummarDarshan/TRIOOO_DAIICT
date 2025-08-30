import { Router } from 'express';
import {
  createAlert,
  getAlerts,
  getActiveAlerts,
  getAlert,
  updateAlert,
  deactivateAlert,
  acknowledgeAlert,
  getUserNotificationPreferences,
  updateUserNotificationPreferences
} from '../controllers/alertController';
import { authenticateToken, requireApprovedStatus } from '../middleware/auth';

const router = Router();

// All routes require authentication and approved status
router.use(authenticateToken);
router.use(requireApprovedStatus);

// Alert routes
router.get('/', getAlerts);
router.get('/active', getActiveAlerts);
router.get('/:id', getAlert);
router.post('/:id/acknowledge', acknowledgeAlert);

// Notification preferences
router.get('/preferences/notifications', getUserNotificationPreferences);
router.put('/preferences/notifications', updateUserNotificationPreferences);

// Admin/Authority only routes
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.post('/:id/deactivate', deactivateAlert);

export default router;
