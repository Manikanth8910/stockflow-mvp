import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import prisma from './prisma';
import { JWTPayload, SessionUser } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'stockflow-dev-secret-key-32-chars-min';
export const TOKEN_COOKIE_NAME = 'stockflow_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string; organizationId?: string | null }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<SessionUser | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { organization: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    organizationId: user.organizationId || null,
    organizationName: user.organization?.name || null,
    defaultLowStockThreshold: user.organization?.defaultLowStockThreshold || 5,
  };
}
