import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/apiRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multi-path dotenv loader for Windows Server & Linux
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.txt'),
  path.resolve(process.cwd(), 'env.txt'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '.env.txt'),
];

for (const envPath of envPaths) {
  try {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
  } catch {
    // Ignore read errors
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API endpoints
app.use('/api', apiRouter);

// Explicit Catch-All for /api/* to guarantee JSON responses (never HTML SPA fallback)
app.all('/api/*', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.path}`,
  });
});

// Global Express Error Handler for /api/*
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Server Error:', err);
  if (req.path.startsWith('/api')) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal Server Error',
    });
  }
  next(err);
});

// Vite Development / Production Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AirRoam eSIM Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
