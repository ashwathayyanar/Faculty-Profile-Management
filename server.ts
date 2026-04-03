import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { z } from 'zod';

// Initialize Database
const db = new Database('faculty.db');

// Create Tables (Relational Schema)
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    designation TEXT NOT NULL,
    department_id INTEGER,
    bio TEXT,
    joining_date DATE,
    avatar_url TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  );

  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_id INTEGER,
    title TEXT NOT NULL,
    journal TEXT,
    year INTEGER,
    doi TEXT,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS research_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_id INTEGER,
    interest TEXT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
  );
`);

// Seed Initial Data if empty
const deptCount = db.prepare('SELECT count(*) as count FROM departments').get() as { count: number };
if (deptCount.count === 0) {
  const insertDept = db.prepare('INSERT INTO departments (name, code) VALUES (?, ?)');
  insertDept.run('Computer Science', 'CS');
  insertDept.run('Electrical Engineering', 'EE');
  insertDept.run('Mechanical Engineering', 'ME');
  insertDept.run('Physics', 'PHY');

  const insertFaculty = db.prepare('INSERT INTO faculty (name, email, designation, department_id, bio, joining_date) VALUES (?, ?, ?, ?, ?, ?)');
  const result = insertFaculty.run('Dr. Alan Turing', 'alan.turing@university.edu', 'Professor', 1, 'Pioneer in computer science and artificial intelligence.', '2010-09-01');
  
  const insertInterest = db.prepare('INSERT INTO research_interests (faculty_id, interest) VALUES (?, ?)');
  insertInterest.run(result.lastInsertRowid, 'Artificial Intelligence');
  insertInterest.run(result.lastInsertRowid, 'Cryptography');

  const insertPub = db.prepare('INSERT INTO publications (faculty_id, title, journal, year) VALUES (?, ?, ?, ?)');
  insertPub.run(result.lastInsertRowid, 'Computing Machinery and Intelligence', 'Mind', 1950);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Get all departments
  app.get('/api/departments', (req, res) => {
    const depts = db.prepare('SELECT * FROM departments').all();
    res.json(depts);
  });

  // Get all faculty with filters
  app.get('/api/faculty', (req, res) => {
    const { dept, search } = req.query;
    let query = `
      SELECT f.*, d.name as department_name 
      FROM faculty f 
      LEFT JOIN departments d ON f.department_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (dept) {
      query += ' AND f.department_id = ?';
      params.push(dept);
    }

    if (search) {
      query += ' AND (f.name LIKE ? OR f.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const faculty = db.prepare(query).all(...params);
    res.json(faculty);
  });

  // Get single faculty profile with relations
  app.get('/api/faculty/:id', (req, res) => {
    const faculty = db.prepare(`
      SELECT f.*, d.name as department_name 
      FROM faculty f 
      LEFT JOIN departments d ON f.department_id = d.id 
      WHERE f.id = ?
    `).get(req.params.id);

    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const publications = db.prepare('SELECT * FROM publications WHERE faculty_id = ?').all(req.params.id);
    const interests = db.prepare('SELECT * FROM research_interests WHERE faculty_id = ?').all(req.params.id);

    res.json({ ...faculty, publications, interests });
  });

  // Create faculty
  app.post('/api/faculty', (req, res) => {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      designation: z.string(),
      department_id: z.number(),
      bio: z.string().optional(),
      joining_date: z.string().optional(),
    });

    try {
      const data = schema.parse(req.body);
      const info = db.prepare(`
        INSERT INTO faculty (name, email, designation, department_id, bio, joining_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(data.name, data.email, data.designation, data.department_id, data.bio, data.joining_date);
      
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Update faculty
  app.put('/api/faculty/:id', (req, res) => {
    const { name, email, designation, department_id, bio, joining_date } = req.body;
    try {
      db.prepare(`
        UPDATE faculty 
        SET name = ?, email = ?, designation = ?, department_id = ?, bio = ?, joining_date = ?
        WHERE id = ?
      `).run(name, email, designation, department_id, bio, joining_date, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Delete faculty
  app.delete('/api/faculty/:id', (req, res) => {
    db.prepare('DELETE FROM faculty WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Manage Research Interests
  app.post('/api/faculty/:id/interests', (req, res) => {
    const { interest } = req.body;
    db.prepare('INSERT INTO research_interests (faculty_id, interest) VALUES (?, ?)').run(req.params.id, interest);
    res.status(201).json({ success: true });
  });

  // Manage Publications
  app.post('/api/faculty/:id/publications', (req, res) => {
    const { title, journal, year, doi } = req.body;
    db.prepare('INSERT INTO publications (faculty_id, title, journal, year, doi) VALUES (?, ?, ?, ?, ?)').run(req.params.id, title, journal, year, doi);
    res.status(201).json({ success: true });
  });

  // --- VITE MIDDLEWARE ---
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
