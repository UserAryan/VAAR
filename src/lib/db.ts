import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'

// Environment variable validation
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
}

// Create Prisma client with enhanced logging
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// Enhanced logging
db.$on('query', (e: Prisma.QueryEvent) => {
  console.log('Query:', {
    query: e.query,
    params: e.params,
    duration: `${e.duration}ms`,
    timestamp: new Date().toISOString(),
  });
});

db.$on('error', (e: Prisma.LogEvent) => {
  console.error('Database error:', {
    message: e.message,
    target: e.target,
    timestamp: new Date().toISOString(),
  });
});

db.$on('info', (e: Prisma.LogEvent) => {
  console.info('Database info:', {
    message: e.message,
    target: e.target,
    timestamp: new Date().toISOString(),
  });
});

db.$on('warn', (e: Prisma.LogEvent) => {
  console.warn('Database warning:', {
    message: e.message,
    target: e.target,
    timestamp: new Date().toISOString(),
  });
});

// Health check function
export const checkDatabaseHealth = async () => {
  try {
    const startTime = Date.now();
    await db.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    console.log(`Database health check passed, response time: ${responseTime}ms`);
    return {
      status: 'healthy',
      responseTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('Initiating database graceful shutdown...');
  try {
    await Promise.race([
      db.$disconnect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database shutdown timeout')), 5000)
      ),
    ]);
    console.log('Database disconnected gracefully');
  } catch (error) {
    console.error('Database shutdown error:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Export types
export type { Prisma }

export default db; 