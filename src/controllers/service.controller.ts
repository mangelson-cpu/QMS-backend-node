import { Request, Response } from 'express';
import Service from '../models/Service';
import SousService from '../models/SousService';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const schema = (req as any).tenantSchema || 'public';
    
    const services = await Service.schema(schema).findAll({
      include: [{ 
        model: SousService.schema(schema), 
        as: 'sous_services' 
      }],
      order: [['created_at', 'DESC']]
    });

    sendResponse(res, 200, true, 'Services récupérés avec succès', { services });
  } catch (error: any) {
    console.error('Erreur getServices:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des services', { error: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { nom_service, code } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    if (!nom_service) {
      return sendResponse(res, 400, false, 'Le nom du service est requis');
    }

    const service = await Service.schema(schema).create({
      nom_service,
      code: code || 'A'
    });

    sendResponse(res, 201, true, 'Service créé avec succès', { service });
  } catch (error: any) {
    console.error('Erreur createService:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création du service', { error: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom_service } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    const service = await Service.schema(schema).findByPk(id as string);
    if (!service) {
      return sendResponse(res, 404, false, 'Service introuvable');
    }

    if (nom_service) service.nom_service = nom_service;
    await service.save();

    sendResponse(res, 200, true, 'Service mis à jour avec succès', { service });
  } catch (error: any) {
    console.error('Erreur updateService:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour du service', { error: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = (req as any).tenantSchema || 'public';
    
    const service = await Service.schema(schema).findByPk(id as string);
    if (!service) {
      return sendResponse(res, 404, false, 'Service introuvable');
    }

    await service.destroy();
    sendResponse(res, 200, true, 'Service supprimé avec succès');
  } catch (error: any) {
    console.error('Erreur deleteService:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression du service', { error: error.message });
  }
};

// --- Sous-Services ---

export const createSousService = async (req: Request, res: Response) => {
  try {
    const { nom_sous_service, service_id } = req.body;
    const schema = (req as any).tenantSchema || 'public';

    if (!nom_sous_service || !service_id) {
      return sendResponse(res, 400, false, 'Le nom du sous-service et l\'ID du service sont requis');
    }

    const sousService = await SousService.schema(schema).create({
      nom_sous_service,
      service_id
    });

    sendResponse(res, 201, true, 'Sous-service créé avec succès', { sousService });
  } catch (error: any) {
    console.error('Erreur createSousService:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création du sous-service', { error: error.message });
  }
};

export const deleteSousService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schema = (req as any).tenantSchema || 'public';
    
    const sousService = await SousService.schema(schema).findByPk(id as string);
    if (!sousService) {
      return sendResponse(res, 404, false, 'Sous-service introuvable');
    }

    await sousService.destroy();
    sendResponse(res, 200, true, 'Sous-service supprimé avec succès');
  } catch (error: any) {
    console.error('Erreur deleteSousService:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression du sous-service', { error: error.message });
  }
};
