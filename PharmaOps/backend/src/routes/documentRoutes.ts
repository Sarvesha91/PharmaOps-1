import { Router } from 'express';

import { getDocuments, postDocument } from '../controllers/documentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getDocuments);
router.post('/', authenticate, postDocument);

export default router;

