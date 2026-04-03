import db from '../config/db.ts';
import { Request, Response } from 'express';

export const getGlobalStats = (req: Request, res: Response) => {
  try {
    const facultyCount = db.prepare('SELECT COUNT(*) as count FROM Faculty').get().count;
    const deptCount = db.prepare('SELECT COUNT(*) as count FROM Departments').get().count;
    
    res.json({ 
      facultyCount, 
      deptCount
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch global stats', details: error.message });
  }
};
