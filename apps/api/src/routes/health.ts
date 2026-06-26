import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'footballeroo-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

router.get('/ready', (_req, res) => {
  // TODO: Check DB and Redis connections
  const checks = {
    database: true, // placeholder
    redis: true, // placeholder
    openai: !!process.env.OPENAI_API_KEY,
  };

  const allHealthy = Object.values(checks).every(Boolean);

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    data: {
      status: allHealthy ? 'ready' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as healthRouter };
