import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Inicializar base de datos con datos de ejemplo en Vercel
if (process.env.VERCEL) {
  import('./init-db').then(({ initializeDatabase }) => {
    initializeDatabase().catch(console.error);
  });
}

console.log("DATABASE_URL en Vercel:", process.env.DATABASE_URL);
