import { Router } from 'express';
import { generateTicket, getTickets, updateTicketStatus } from '../controllers/ticket.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

// Generation (Borne) might not need full auth if it's a kiosk, 
// but for now we keep it secured or use a specific middleware.
router.use(verifyToken);
router.use(tenantMiddleware);

router.post('/generate', generateTicket);
router.get('/', getTickets);
router.put('/:id/status', updateTicketStatus);

export default router;
