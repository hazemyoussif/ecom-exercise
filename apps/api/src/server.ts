import express, { type Express } from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';

const publicPath = path.resolve(__dirname, '../public');
const webBuildPath = path.resolve(__dirname, '../../web/dist');
const webIndexPath = path.join(webBuildPath, 'index.html');

export function createApp(): Express {
  const app = express();

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/api/data', (_req, res) => {
    res.sendFile(path.join(publicPath, 'data.json'));
  });

  app.use(express.static(publicPath));

  if (existsSync(webBuildPath)) {
    app.use(express.static(webBuildPath));
    app.get('/{*splat}', (_req, res) => res.sendFile(webIndexPath));
  }

  return app;
}

export function startServer(port = Number(process.env.PORT ?? 3000)) {
  return createApp().listen(port, () => {
    console.log(`Bundle Builder API running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}