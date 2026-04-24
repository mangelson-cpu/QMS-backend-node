import { Request, Response, NextFunction } from 'express';

export const requireRole = (roles: Array<'super_admin' | 'admin' | 'user'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Accès interdit. Privilèges insuffisants.' });
    }

    next();
  };
};
