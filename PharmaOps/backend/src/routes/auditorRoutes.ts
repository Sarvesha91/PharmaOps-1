import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '../types/roles';
import * as auditorController from '../controllers/auditorController';

const router = Router();

router.use(authenticate);
router.use(requireRole(Role.Auditor));

router.get('/audit-logs', auditorController.getAuditLogs);
router.get('/evidence-packs', auditorController.getEvidencePacks);

export default router;
