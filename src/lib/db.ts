/**
 * Singleton de PrismaClient para Next.js
 * 
 * En desarrollo, Next.js hace hot-reload y crearía múltiples 
 * instancias de PrismaClient. Este patrón lo previene guardando
 * la instancia en el objeto global de Node.js.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
