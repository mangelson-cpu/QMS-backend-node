import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as string;

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        agence_id: user.agence_id,
        filiale_id: user.filiale_id
      },
      secret,
      { expiresIn: expiresIn as any }
    );

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    });

  } catch (error: any) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion', error: error.message });
  }
};
