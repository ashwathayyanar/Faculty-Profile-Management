import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB } from './config/db.ts';
import facultyRoutes from './routes/facultyRoutes.ts';
import departmentRoutes from './routes/departmentRoutes.ts';
import statsRoutes from './routes/statsRoutes.ts';

async function startServer() {
  // Initialize Database
  await initDB();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---
  app.use('/api/faculty', facultyRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/stats', statsRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is live', database: 'Connected' });
  });

  // --- VITE MIDDLEWARE ---
  // This serves the frontend in development and production
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

  app.listen(PORT, () => {
    console.log(`🚀 Hackathon Server running at http://localhost:${PORT}`);
  });
}

startServer();
