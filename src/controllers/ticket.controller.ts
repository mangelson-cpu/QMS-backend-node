import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Ticket from '../models/Ticket';
import Service from '../models/Service';
import Priority from '../models/Priority';
import Agence from '../models/Agence';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

// --- Generation Logic ---
export const generateTicket = async (req: Request, res: Response) => {
  try {
    const { service_id, agence_id, priority_id } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    if (!service_id || !agence_id || !priority_id) {
      return sendResponse(res, 400, false, 'Service, Agence et Priorité sont requis');
    }

    // 1. Get service code
    const service = await Service.schema(schema).findByPk(service_id);
    if (!service) return sendResponse(res, 404, false, 'Service introuvable');

    // 2. Count tickets for this agence today to get the next number
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Ticket.schema(schema).count({
      where: {
        agence_id,
        created_at: { [Op.gte]: today }
      }
    });

    const nextNumber = (count + 1).toString().padStart(3, '0');
    const ticketNumero = `${service.code}${nextNumber}`;

    // 3. Create ticket
    const ticket = await Ticket.schema(schema).create({
      numero: ticketNumero,
      service_id,
      agence_id,
      priority_id,
      status: 'en_attente'
    });

    sendResponse(res, 201, true, 'Ticket généré avec succès', { ticket });
  } catch (error: any) {
    console.error('Erreur generateTicket:', error);
    sendResponse(res, 500, false, 'Erreur lors de la génération du ticket', { error: error.message });
  }
};

// --- Get Tickets (for screen or list) ---
export const getTickets = async (req: Request, res: Response) => {
  try {
    const { agence_id, status } = req.query;
    const schema = (req as any).tenantSchema || 'public';

    const where: any = {};
    if (agence_id) where.agence_id = agence_id;
    if (status) where.status = status;

    const tickets = await Ticket.schema(schema).findAll({
      where,
      include: [
        { model: Service.schema(schema), as: 'service', attributes: ['nom_service', 'code'] },
        { model: Priority.schema(schema), as: 'priority', attributes: ['nom', 'valeur', 'couleur'] }
      ],
      order: [['created_at', 'ASC']]
    });

    sendResponse(res, 200, true, 'Tickets récupérés avec succès', { tickets });
  } catch (error: any) {
    console.error('Erreur getTickets:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des tickets', { error: error.message });
  }
};

// --- Update Status (Call, Start, End) ---
export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, guichet_id } = req.body;
    const schema = (req as any).tenantSchema || 'public';
    const user_id = (req as any).user?.id;

    const ticket = await Ticket.schema(schema).findByPk(id as string);
    if (!ticket) return sendResponse(res, 404, false, 'Ticket introuvable');

    if (status === 'en_cours') {
      ticket.status = 'en_cours';
      ticket.guichet_id = guichet_id || ticket.guichet_id;
      ticket.user_id = user_id || ticket.user_id;
      ticket.called_at = ticket.called_at || new Date();
      ticket.started_at = new Date();
    } else if (status === 'termine') {
      ticket.status = 'termine';
      ticket.ended_at = new Date();
    } else if (status === 'annule') {
      ticket.status = 'annule';
    } else if (status === 'rappelle') {
      ticket.status = 'en_attente'; // Put back in queue or specific state
      ticket.called_at = new Date();
    }

    await ticket.save();
    sendResponse(res, 200, true, 'Statut du ticket mis à jour', { ticket });
  } catch (error: any) {
    console.error('Erreur updateTicketStatus:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour du ticket', { error: error.message });
  }
};
