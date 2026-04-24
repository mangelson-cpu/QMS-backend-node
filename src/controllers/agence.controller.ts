import { Request, Response } from 'express';
import Agence from '../models/Agence';
import Filiale from '../models/Filiale';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

const generateSlug = (nom: string) => {
  return nom
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const getAgences = async (req: Request, res: Response) => {
  try {
    const schema = (req as any).tenantSchema || 'public';
    
    const agences = await Agence.schema(schema).findAll({
      include: [{ model: Filiale, as: 'filiale', attributes: ['nom'] }],
      order: [['created_at', 'DESC']]
    });

    sendResponse(res, 200, true, 'Agences récupérées avec succès', { agences });
  } catch (error: any) {
    console.error('Erreur getAgences:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des agences', { error: error.message });
  }
};

export const createAgence = async (req: Request, res: Response) => {
  try {
    const { nom, adresse } = req.body;
    const schema = (req as any).tenantSchema || 'public';
    const filiale_id = (req as any).user?.filiale_id || req.headers['x-filiale-id'];

    if (!nom) {
      return sendResponse(res, 400, false, 'Le nom de l\'agence est requis');
    }

    const slug = generateSlug(nom);

    const agence = await Agence.schema(schema).create({
      nom,
      adresse: adresse || null,
      slug,
      filiale_id: (filiale_id as string) || null
    });

    sendResponse(res, 201, true, 'Agence créée avec succès', { agence });
  } catch (error: any) {
    console.error('Erreur createAgence:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création de l\'agence', { error: error.message });
  }
};

export const updateAgence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, adresse } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    const agence = await Agence.schema(schema).findByPk(id as string);
    if (!agence) {
      return sendResponse(res, 404, false, 'Agence introuvable');
    }

    if (nom) {
      agence.nom = nom;
      agence.slug = generateSlug(nom);
    }
    if (adresse !== undefined) agence.adresse = adresse;

    await agence.save();

    sendResponse(res, 200, true, 'Agence mise à jour avec succès', { agence });
  } catch (error: any) {
    console.error('Erreur updateAgence:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour de l\'agence', { error: error.message });
  }
};

export const deleteAgence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = (req as any).tenantSchema || 'public';
    
    const agence = await Agence.schema(schema).findByPk(id as string);

    if (!agence) {
      return sendResponse(res, 404, false, 'Agence introuvable');
    }

    await agence.destroy();
    sendResponse(res, 200, true, 'Agence supprimée avec succès');
  } catch (error: any) {
    console.error('Erreur deleteAgence:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression de l\'agence', { error: error.message });
  }
};

export const updateKioskPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    const agence = await Agence.schema(schema).findByPk(id as string);
    if (!agence) {
      return sendResponse(res, 404, false, 'Agence introuvable');
    }

    agence.kiosk_password = password || null;
    await agence.save();

    sendResponse(res, 200, true, 'Mot de passe de la borne mis à jour avec succès');
  } catch (error: any) {
    console.error('Erreur updateKioskPassword:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour du mot de passe de la borne', { error: error.message });
  }
};
