import { Router } from 'express';
import { getGuichets, createGuichet, updateGuichet, deleteGuichet } from '../controllers/guichet.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

router.use(verifyToken);
router.use(tenantMiddleware);

router.get('/', getGuichets);
router.post('/', requireRole(['super_admin', 'admin']), createGuichet);
router.put('/:id', requireRole(['super_admin', 'admin']), updateGuichet);
router.delete('/:id', requireRole(['super_admin', 'admin']), deleteGuichet);

export default router;
