import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '../types/roles';
import * as qaController from '../controllers/qaController';

const router = Router();

router.use(authenticate);
router.use(requireRole(Role.QA));

router.get('/review-queue', qaController.getReviewQueue);
router.post('/approve-document', qaController.approveDocument);
router.post('/reject-document', qaController.rejectDocument);
router.get('/review-document/:documentId', qaController.reviewDocumentSplitScreen);
router.post('/approve-document-with-signature', qaController.approveDocumentWithSignature);
router.post('/reject-document-with-notes', qaController.rejectDocumentWithNotes);
router.get('/order-review-queue', qaController.getOrderReviewQueue);

export default router;
