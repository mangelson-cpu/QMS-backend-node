import { Request, Response } from 'express';
import Priority from '../models/Priority';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

export const getPriorities = async (req: Request, res: Response) => {
  try {
    const schema = (req as any).tenantSchema || 'public';
    
    const priorities = await Priority.schema(schema).findAll({
      order: [['valeur', 'ASC']]
    });

    sendResponse(res, 200, true, 'Priorités récupérées avec succès', { priorities });
  } catch (error: any) {
    console.error('Erreur getPriorities:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des priorités', { error: error.message });
  }
};

export const createPriority = async (req: Request, res: Response) => {
  try {
    const { nom, valeur, couleur } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    if (!nom) {
      return sendResponse(res, 400, false, 'Le nom de la priorité est requis');
    }

    const priority = await Priority.schema(schema).create({
      nom,
      valeur: valeur !== undefined ? valeur : 3,
      couleur: couleur || '#8b5cf6'
    });

    sendResponse(res, 201, true, 'Priorité créée avec succès', { priority });
  } catch (error: any) {
    console.error('Erreur createPriority:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création de la priorité', { error: error.message });
  }
};

export const updatePriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, valeur, couleur } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    const priority = await Priority.schema(schema).findByPk(id as string);
    if (!priority) {
      return sendResponse(res, 404, false, 'Priorité introuvable');
    }

    if (nom) priority.nom = nom;
    if (valeur !== undefined) priority.valeur = valeur;
    if (couleur) priority.couleur = couleur;

    await priority.save();

    sendResponse(res, 200, true, 'Priorité mise à jour avec succès', { priority });
  } catch (error: any) {
    console.error('Erreur updatePriority:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour de la priorité', { error: error.message });
  }
};

export const deletePriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = (req as any).tenantSchema || 'public';
    
    const priority = await Priority.schema(schema).findByPk(id as string);
    if (!priority) {
      return sendResponse(res, 404, false, 'Priorité introuvable');
    }

    await priority.destroy();
    sendResponse(res, 200, true, 'Priorité supprimée avec succès');
  } catch (error: any) {
    console.error('Erreur deletePriority:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression de la priorité', { error: error.message });
  }
};
