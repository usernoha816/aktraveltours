import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import express from 'express';
import { defineConfig, Plugin } from 'vite';
import { apiRouter } from './src/server/apiRouter';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      const devApp = express();
      devApp.use(express.json());
      devApp.use(express.urlencoded({ extended: true }));
      devApp.use('/api', apiRouter);

      // Explicit JSON catch-all for any unhandled /api/* requests
      devApp.all('/api/*', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).json({
          success: false,
          error: `API route not found: ${req.method} ${req.path}`,
        });
      });

      // Terminal error handler
      devApp.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error('API Middleware Error:', err);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
          success: false,
          error: err?.message || 'Internal Server Error',
        });
      });

      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/api' || req.url.startsWith('/api/') || req.url.startsWith('/api?'))) {
          return devApp(req as any, res as any, () => {
            // Guarantee JSON response if Express reaches end of pipeline
            if (!res.headersSent) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: `Endpoint not found: ${req.url}` }));
            }
          });
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
