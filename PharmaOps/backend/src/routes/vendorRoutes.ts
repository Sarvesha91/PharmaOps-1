import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '../types/roles';
import * as vendorController from '../controllers/vendorController';

const router = Router();

router.use(authenticate);
router.use(requireRole(Role.Vendor));

router.get('/requests', vendorController.getMyRequests);
router.post('/documents', vendorController.uploadDocument);
router.post('/shipments', vendorController.createShipment);
router.post('/check-compliance', vendorController.checkOrderCompliance);

export default router;
