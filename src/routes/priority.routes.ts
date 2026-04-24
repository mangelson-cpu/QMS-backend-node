import { Router } from 'express';
import { getPriorities, createPriority, updatePriority, deletePriority } from '../controllers/priority.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

router.use(verifyToken);
router.use(tenantMiddleware);

router.get('/', getPriorities);
router.post('/', requireRole(['super_admin', 'admin']), createPriority);
router.put('/:id', requireRole(['super_admin', 'admin']), updatePriority);
router.delete('/:id', requireRole(['super_admin', 'admin']), deletePriority);

export default router;
