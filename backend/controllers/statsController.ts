import pool from '../config/db.ts';
import { Request, Response } from 'express';

export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const facultyResult = await pool.query('SELECT COUNT(*) as count FROM Faculty');
    const deptResult = await pool.query('SELECT COUNT(*) as count FROM Departments');
    
    res.json({ 
      facultyCount: parseInt(facultyResult.rows[0].count, 10), 
      deptCount: parseInt(deptResult.rows[0].count, 10)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch global stats', details: error.message });
  }
};
