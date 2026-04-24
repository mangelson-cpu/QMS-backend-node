import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

router.use(verifyToken);
router.use(tenantMiddleware);

router.get('/', getUsers);
router.post('/', requireRole(['super_admin', 'admin']), createUser);
router.put('/:id', requireRole(['super_admin', 'admin']), updateUser);
router.delete('/:id', requireRole(['super_admin', 'admin']), deleteUser);

export default router;
