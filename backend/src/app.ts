import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { ApiResponse } from './utils/ApiResponse';

// ─── Nikhil's route modules ───────────────────────────────────────────────────
import authRoutes      from './modules/auth/auth.routes';
import artisansRoutes  from './modules/artisans/artisans.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

// ─── Team integration stubs (uncomment when each member adds their routes) ────
// import aiRoutes        from './modules/ai/ai.routes';               // Suhani
// import inventoryRoutes from './modules/inventory/inventory.routes'; // Vishwajit
// import pricingRoutes   from './modules/pricing/pricing.routes';     // Vishwajit
// import catalogRoutes   from './modules/catalog/catalog.routes';     // Vishwajit

export function createApp(): Application {
  const app = express();

  // ── Security & parsing ───────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── Health check ─────────────────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    ApiResponse.success(res, 'Kaarigar AI API is running.', {
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
    });
  });

  // ── API v1 routes ─────────────────────────────────────────────────────────
  app.use('/api/v1/auth',      authRoutes);
  app.use('/api/v1/artisans',  artisansRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);

  // app.use('/api/v1/ai',        aiRoutes);        // Suhani
  // app.use('/api/v1/inventory', inventoryRoutes); // Vishwajit
  // app.use('/api/v1/pricing',   pricingRoutes);   // Vishwajit
  // app.use('/api/v1/catalog',   catalogRoutes);   // Vishwajit

  // ── 404 fallback ──────────────────────────────────────────────────────────
  app.use((req: Request, res: Response) => {
    ApiResponse.error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
  });

  // ── Centralised error handler (must be last) ──────────────────────────────
  app.use(errorHandler);

  return app;
}

