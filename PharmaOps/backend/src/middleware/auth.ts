import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getEnv } from '../config/env';
import { Role, UserPayload } from '../types/roles';

const JWT_SECRET = getEnv('JWT_SECRET', 'pharmaops-secret');

export type AuthRequest = Request & { user?: UserPayload };

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    (req as AuthRequest).user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (allowed: Role[] | Role) => {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  return (req: Request, res: Response, next: NextFunction) => {
    const r = req as AuthRequest;
    const role = r.user?.role as Role | undefined;
    if (!role || !allowedRoles.includes(role as Role)) {
      return res.status(403).json({ message: 'Forbidden - insufficient role' });
    }
    return next();
  };
};

