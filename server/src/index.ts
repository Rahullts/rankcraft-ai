import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { healthRouter } from './routes/health.js';
import { promptsRouter } from './routes/prompts.js';
import { generateRouter } from './routes/generate.js';
import { simpleRouter } from './routes/simple.js';
import { AppError, ApiErrorResponse } from './lib/errors.js';
import { logEvent } from './lib/logger.js';

const app = express();

// 1. CORS allowing local frontend origins (Section A9)
const allowedOrigins = [
  config.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8787',
  'http://127.0.0.1:8787'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local development
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Body limit 50 kb (Section A9)
app.use(express.json({ limit: '50kb' }));

// 3. Rate limiting on /api/* (Section A9) - bypassed in test mode
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: config.RATE_LIMIT_PER_MIN,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/api/health' || req.originalUrl.includes('/health'),
  handler: (req, res) => {
    const errorResponse: ApiErrorResponse = {
      ok: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Wait a moment, then retry.',
        retryable: true
      }
    };
    res.status(429).json(errorResponse);
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.use('/api', apiLimiter);
}

// 4. Routes
app.use('/api', healthRouter);
app.use('/api', promptsRouter);
app.use('/api', generateRouter);
app.use('/api', simpleRouter);

// 5. Centralized Error Handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL';
  const retryable = err instanceof AppError ? err.retryable : false;
  const stage = err instanceof AppError ? err.stage : undefined;

  // Safe user-facing error copy (Section A9 / B6)
  const message =
    err instanceof AppError
      ? err.message
      : 'Something went wrong on the server. Retry, or check the server logs.';

  logEvent({
    route: req.originalUrl || req.url,
    stage,
    status: 'ERROR',
    statusCode,
    errorCode: code
  });

  const errorResponse: ApiErrorResponse = {
    ok: false,
    error: {
      code,
      message,
      retryable,
      stage
    }
  };

  res.status(statusCode).json(errorResponse);
});

// 6. Server Listener
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`[RankCraft Server] Running on http://127.0.0.1:${config.PORT} and http://localhost:${config.PORT}`);
    console.log(`[RankCraft Server] Provider: ${config.LLM_PROVIDER} (Mock: ${config.LLM_PROVIDER === 'mock'})`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[RankCraft Server Error] Port ${config.PORT} is already in use by another process.`);
      console.error(`To free port ${config.PORT}, close the conflicting process or run: npx kill-port ${config.PORT}`);
    } else {
      console.error('[RankCraft Server Error]', err);
    }
  });
}

export default app;
