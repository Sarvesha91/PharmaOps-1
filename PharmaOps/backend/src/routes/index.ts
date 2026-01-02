import express from 'express';

import adminRoutes from './adminRoutes';
import auditorRoutes from './auditorRoutes';
import authRoutes from './authRoutes';
import documentRoutes from './documentRoutes';
import healthRoutes from './healthRoutes';
import orderRoutes from './orderRoutes';
import qaRoutes from './qaRoutes';
import vendorRoutes from './vendorRoutes';

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/auditor', auditorRoutes);
router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/health', healthRoutes);
router.use('/orders', orderRoutes);
router.use('/qa', qaRoutes);
router.use('/vendor', vendorRoutes);

export default router;
