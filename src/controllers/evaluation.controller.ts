import { Request, Response } from 'express';
import Evaluation from '../models/Evaluation';
import Ticket from '../models/Ticket';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

export const createEvaluation = async (req: Request, res: Response) => {
  try {
    const { ticket_id, score, commentaire } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    if (!ticket_id || !score) {
      return sendResponse(res, 400, false, 'Le ticket_id et le score sont requis');
    }

    // Check if evaluation already exists for this ticket
    const existing = await Evaluation.schema(schema).findOne({ where: { ticket_id } });
    if (existing) {
      return sendResponse(res, 400, false, 'Ce ticket a déjà été évalué');
    }

    const evaluation = await Evaluation.schema(schema).create({
      ticket_id,
      score,
      commentaire
    });

    sendResponse(res, 201, true, 'Merci pour votre évaluation !', { evaluation });
  } catch (error: any) {
    console.error('Erreur createEvaluation:', error);
    sendResponse(res, 500, false, 'Erreur lors de l\'enregistrement de l\'évaluation', { error: error.message });
  }
};

export const getEvaluations = async (req: Request, res: Response) => {
  try {
    const schema = (req as any).tenantSchema || 'public';
    const { ticket_id } = req.query;

    const where: any = {};
    if (ticket_id) where.ticket_id = ticket_id;

    const evaluations = await Evaluation.schema(schema).findAll({
      where,
      include: [{ model: Ticket.schema(schema), as: 'ticket', attributes: ['numero', 'status'] }],
      order: [['created_at', 'DESC']]
    });

    sendResponse(res, 200, true, 'Évaluations récupérées avec succès', { evaluations });
  } catch (error: any) {
    console.error('Erreur getEvaluations:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des évaluations', { error: error.message });
  }
};
