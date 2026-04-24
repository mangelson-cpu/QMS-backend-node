import { Router } from 'express';
import { createEvaluation, getEvaluations } from '../controllers/evaluation.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(tenantMiddleware);

router.post('/', createEvaluation);
router.get('/', verifyToken, requireRole(['super_admin', 'admin']), getEvaluations);

export default router;
