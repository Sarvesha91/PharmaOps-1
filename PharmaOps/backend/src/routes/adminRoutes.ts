import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '../types/roles';
import * as adminController from '../controllers/adminController';

const router = Router();

router.use(authenticate);
router.use(requireRole(Role.Admin));

router.post('/invite-vendor', adminController.inviteVendor);
router.post('/define-requirements', adminController.defineRequirements);
router.post('/upload-master-document', adminController.uploadMasterDocument);
router.post('/create-request', adminController.createRequest);
router.get('/tracking', adminController.getTracking);

router.get('/vendors', adminController.getVendors);
router.get('/products', adminController.getProducts);
router.get('/dashboard-stats', adminController.getDashboardStats);

export default router;
