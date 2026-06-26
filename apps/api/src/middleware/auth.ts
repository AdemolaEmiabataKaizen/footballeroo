import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error-handler';

// ============================================================
// Auth Middleware for Express API
// ============================================================

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

/**
 * Middleware: Require authentication.
 * Validates JWT from Authorization header (Bearer token).
 */
export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: string;
      email: string;
    };

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Invalid token', 401);
  }
}

/**
 * Middleware: Require admin role.
 * Must be used after requireAuth.
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (req.userRole !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }
  next();
}

/**
 * Middleware: Optional authentication.
 * Attaches user info if token present, but doesn't block if missing.
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        role: string;
        email: string;
      };

      req.userId = decoded.id;
      req.userRole = decoded.role;
    } catch {
      // Token invalid — proceed without auth (non-blocking)
    }
  }

  next();
}
