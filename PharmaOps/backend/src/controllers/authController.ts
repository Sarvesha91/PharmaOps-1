import { Request, Response } from 'express';
import { authService, RegisterData, LoginData } from '../services/authService';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const data: RegisterData = req.body;
    const user = await authService.register(data);
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginData = req.body;
    const authResponse = await authService.login(data);
    res.cookie('token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.json(authResponse);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { passwordHash, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
