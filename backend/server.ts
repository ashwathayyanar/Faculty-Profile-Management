import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB } from './config/db.js';
import facultyRoutes from './routes/facultyRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.use('/api/faculty', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is live', database: 'Connected' });
});

app.get('/api/init-db', async (req, res) => {
  try {
    const result = await initDB();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

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

// Only start the server locally. Vercel will import the app directly.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
