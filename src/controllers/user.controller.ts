import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({ success, message, ...data });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });

    sendResponse(res, 200, true, 'Utilisateurs récupérés avec succès', { users });
  } catch (error: any) {
    console.error('Erreur getUsers:', error);
    sendResponse(res, 500, false, 'Erreur lors de la récupération des utilisateurs', { error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, nom_user, role, agence_id, filiale_id } = req.body;

    if (!email || !password || !nom_user) {
      return sendResponse(res, 400, false, 'Email, mot de passe et nom sont requis');
    }

    if (password.length < 6) {
      return sendResponse(res, 400, false, 'Le mot de passe doit contenir au moins 6 caractères');
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendResponse(res, 400, false, 'Cet email est déjà utilisé');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      nom_user,
      password: hashedPassword,
      role: role || 'user',
      agence_id: agence_id || null,
      filiale_id: filiale_id || null
    });

    // Remove password from response
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    sendResponse(res, 201, true, 'Utilisateur créé avec succès', { user: userWithoutPassword });
  } catch (error: any) {
    console.error('Erreur createUser:', error);
    sendResponse(res, 500, false, 'Erreur lors de la création de l\'utilisateur', { error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, nom_user, role, agence_id, filiale_id } = req.body;

    const user = await User.findByPk(id as string);
    if (!user) {
      return sendResponse(res, 404, false, 'Utilisateur introuvable');
    }

    // Check if email is taken by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return sendResponse(res, 400, false, 'Cet email est déjà utilisé par un autre compte');
      }
      user.email = email;
    }

    if (nom_user) user.nom_user = nom_user;
    if (role) user.role = role;
    if (agence_id !== undefined) user.agence_id = agence_id;
    if (filiale_id !== undefined) user.filiale_id = filiale_id;

    if (password) {
      if (password.length < 6) {
        return sendResponse(res, 400, false, 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    sendResponse(res, 200, true, 'Utilisateur mis à jour avec succès', { user: userWithoutPassword });
  } catch (error: any) {
    console.error('Erreur updateUser:', error);
    sendResponse(res, 500, false, 'Erreur lors de la mise à jour de l\'utilisateur', { error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id as string);

    if (!user) {
      return sendResponse(res, 404, false, 'Utilisateur introuvable');
    }

    await user.destroy();
    sendResponse(res, 200, true, 'Utilisateur supprimé avec succès');
  } catch (error: any) {
    console.error('Erreur deleteUser:', error);
    sendResponse(res, 500, false, 'Erreur lors de la suppression de l\'utilisateur', { error: error.message });
  }
};
