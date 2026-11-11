import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl(): string {
  if (process.env.VERCEL) {
    const tmpDb = '/tmp/stockflow.db';
    if (!fs.existsSync(tmpDb)) {
      try {
        const rootDb = path.join(process.cwd(), 'prisma', 'dev.db');
        if (fs.existsSync(rootDb)) {
          fs.copyFileSync(rootDb, tmpDb);
        }
      } catch (e) {
        console.error('Failed to copy db to /tmp on Vercel:', e);
      }
    }
    return `file:${tmpDb}`;
  }
  return process.env.DATABASE_URL || 'file:./dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
