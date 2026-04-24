import { Request, Response } from 'express';
import Filiale from '../models/Filiale';
import { createSchema, getTenantSchemaName } from '../utils/schema.utils';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

export const getFiliales = async (req: Request, res: Response) => {
  try {
    const filiales = await Filiale.findAll({
      order: [['created_at', 'DESC']]
    });
    sendResponse(res, 200, true, 'Filiales récupérées avec succès', { filiales });
  } catch (error: any) {
    console.error('Erreur getFiliales:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des filiales', { error: error.message });
  }
};

export const createFiliale = async (req: Request, res: Response) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return sendResponse(res, 400, false, 'Le nom de la filiale est requis');
    }

    const tempFiliale = await Filiale.create({
      nom,
      schema_name: 'pending'
    });

    const schemaName = getTenantSchemaName(nom, tempFiliale.id);

    await createSchema(schemaName);

    tempFiliale.schema_name = schemaName;
    await tempFiliale.save();

    sendResponse(res, 201, true, 'Filiale et schéma créés avec succès', { filiale: tempFiliale });
  } catch (error: any) {
    console.error('Erreur createFiliale:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création de la filiale', { error: error.message });
  }
};

export const updateFiliale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    const filiale = await Filiale.findByPk(id as string);
    if (!filiale) {
      return sendResponse(res, 404, false, 'Filiale introuvable');
    }

    if (nom) filiale.nom = nom;

    await filiale.save();

    sendResponse(res, 200, true, 'Filiale mise à jour avec succès', { filiale });
  } catch (error: any) {
    console.error('Erreur updateFiliale:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour de la filiale', { error: error.message });
  }
};

export const deleteFiliale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filiale = await Filiale.findByPk(id as string);

    if (!filiale) {
      return sendResponse(res, 404, false, 'Filiale introuvable');
    }

    await filiale.destroy();
    sendResponse(res, 200, true, 'Filiale supprimée avec succès');
  } catch (error: any) {
    console.error('Erreur deleteFiliale:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression de la filiale', { error: error.message });
  }
};
