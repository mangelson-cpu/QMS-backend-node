import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/db';
import Filiale from '../models/Filiale';

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get filiale_id from user (attached by verifyToken middleware)
    const user = (req as any).user;
    let filialeId = user?.filiale_id;

    // If super_admin, allow overriding filiale via header
    if (user?.role === 'super_admin' && req.headers['x-filiale-id']) {
      filialeId = req.headers['x-filiale-id'] as string;
    }
    
    if (!filialeId) {
      await sequelize.query('SET search_path TO public;');
      return next();
    }

    const filiale = await Filiale.findByPk(filialeId);
    
    if (!filiale) {
      return res.status(404).json({ success: false, message: 'Filiale associée introuvable' });
    }

    // 3. Get the schema name (stored in the filiale record)
    // For now, we calculate it or assume it's stored. 
    // Let's assume we add a 'schema_name' field to Filiale.
    const schemaName = (filiale as any).schema_name || 'public';

    // Attach schema info to request for controllers to use
    (req as any).tenantSchema = schemaName;
    
    next();
  } catch (error: any) {
    console.error('Error in tenantMiddleware:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la configuration du tenant', error: error.message });
  }
};
