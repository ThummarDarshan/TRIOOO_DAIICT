import { Router } from 'express';
import {
  createIncidentReport,
  getIncidentReports,
  getIncidentReport,
  updateIncidentReport,
  verifyIncidentReport,
  resolveIncidentReport
} from '../controllers/incidentController';
import { authenticateToken, requireApprovedStatus } from '../middleware/auth';

const router = Router();

// All routes require authentication and approved status
router.use(authenticateToken);
router.use(requireApprovedStatus);

// Incident report routes
router.post('/', createIncidentReport);
router.get('/', getIncidentReports);
router.get('/:id', getIncidentReport);
router.put('/:id', updateIncidentReport);

// Admin/Authority only routes
router.post('/:id/verify', verifyIncidentReport);
router.post('/:id/resolve', resolveIncidentReport);

export default router;
