import { Router } from 'express';
import { getFiliales, createFiliale, updateFiliale, deleteFiliale } from '../controllers/filiale.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(verifyToken);
router.use(requireRole(['super_admin']));

router.get('/', getFiliales);
router.post('/', createFiliale);
router.put('/:id', updateFiliale);
router.delete('/:id', deleteFiliale);

export default router;
