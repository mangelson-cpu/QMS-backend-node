import { Router } from 'express';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService,
  createSousService,
  deleteSousService
} from '../controllers/service.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

router.use(verifyToken);
router.use(tenantMiddleware);

// Services
router.get('/', getServices);
router.post('/', requireRole(['super_admin', 'admin']), createService);
router.put('/:id', requireRole(['super_admin', 'admin']), updateService);
router.delete('/:id', requireRole(['super_admin', 'admin']), deleteService);

// Sous-services
router.post('/sub', requireRole(['super_admin', 'admin']), createSousService);
router.delete('/sub/:id', requireRole(['super_admin', 'admin']), deleteSousService);

export default router;
