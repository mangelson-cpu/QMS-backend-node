import { Router } from 'express';
import { getAgences, createAgence, updateAgence, deleteAgence, updateKioskPassword } from '../controllers/agence.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

router.use(verifyToken);
router.use(tenantMiddleware);

router.get('/', getAgences);
router.post('/', requireRole(['super_admin']), createAgence);
router.put('/:id', requireRole(['super_admin', 'admin']), updateAgence);
router.delete('/:id', requireRole(['super_admin', 'admin']), deleteAgence);
router.put('/:id/kiosk-password', requireRole(['super_admin', 'admin']), updateKioskPassword);

export default router;
