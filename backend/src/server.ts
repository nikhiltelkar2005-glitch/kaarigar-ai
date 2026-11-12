import { createApp } from './app';
import { env } from './config/env';
import { db } from './config/database';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀  Server listening on port ${env.PORT}  [${env.NODE_ENV}]`);
  logger.info(`🔗  Health check → http://localhost:${env.PORT}/health`);
});

// ── Graceful shutdown ──────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully…`);
  server.close(async () => {
    await db.$disconnect();
    logger.info('Database disconnected. Goodbye.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

