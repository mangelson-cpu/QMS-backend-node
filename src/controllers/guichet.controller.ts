import { Request, Response } from 'express';
import Guichet from '../models/Guichet';
import Agence from '../models/Agence';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

export const getGuichets = async (req: Request, res: Response) => {
  try {
    const schema = (req as any).tenantSchema || 'public';
    const { agence_id } = req.query;

    const where: any = {};
    if (agence_id) where.agence_id = agence_id;

    const guichets = await Guichet.schema(schema).findAll({
      where,
      include: [{ model: Agence.schema(schema), as: 'agence', attributes: ['nom'] }],
      order: [['nom', 'ASC']]
    });

    sendResponse(res, 200, true, 'Guichets récupérés avec succès', { guichets });
  } catch (error: any) {
    console.error('Erreur getGuichets:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des guichets', { error: error.message });
  }
};

export const createGuichet = async (req: Request, res: Response) => {
  try {
    const { nom, type, agence_id } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    if (!nom || !agence_id) {
      return sendResponse(res, 400, false, 'Le nom et l\'agence sont requis');
    }

    const guichet = await Guichet.schema(schema).create({
      nom,
      type: type || 'standard',
      agence_id,
      status: 'ferme'
    });

    sendResponse(res, 201, true, 'Guichet créé avec succès', { guichet });
  } catch (error: any) {
    console.error('Erreur createGuichet:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création du guichet', { error: error.message });
  }
};

export const updateGuichet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, type, status } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    const guichet = await Guichet.schema(schema).findByPk(id as string);
    if (!guichet) {
      return sendResponse(res, 404, false, 'Guichet introuvable');
    }

    if (nom) guichet.nom = nom;
    if (type) guichet.type = type;
    if (status) guichet.status = status;

    await guichet.save();

    sendResponse(res, 200, true, 'Guichet mis à jour avec succès', { guichet });
  } catch (error: any) {
    console.error('Erreur updateGuichet:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour du guichet', { error: error.message });
  }
};

export const deleteGuichet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = (req as any).tenantSchema || 'public';
    
    const guichet = await Guichet.schema(schema).findByPk(id as string);
    if (!guichet) {
      return sendResponse(res, 404, false, 'Guichet introuvable');
    }

    await guichet.destroy();
    sendResponse(res, 200, true, 'Guichet supprimé avec succès');
  } catch (error: any) {
    console.error('Erreur deleteGuichet:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression du guichet', { error: error.message });
  }
};
