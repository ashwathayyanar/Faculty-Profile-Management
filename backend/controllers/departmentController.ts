import pool from '../config/db.js';
import { Request, Response } from 'express';

/**
 * Controller for Department-related operations
 */
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        d.*,
        (SELECT COUNT(*) FROM Faculty WHERE DepartmentID = d.DepartmentID) as facultyCount
      FROM Departments d
      ORDER BY d.DepartmentName ASC
    `;
    const result = await pool.query(query);
    
    // Convert facultyCount to number since postgres might return it as a string from COUNT()
    const departments = result.rows.map(dept => ({
      ...dept,
      facultyCount: parseInt(dept.facultycount, 10)
    }));
    
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { HeadOfDepartment } = req.body;

  if (!HeadOfDepartment) {
    return res.status(400).json({ error: 'Head of Department is required' });
  }

  try {
    const query = 'UPDATE Departments SET HeadOfDepartment = $1 WHERE DepartmentID = $2';
    const result = await pool.query(query, [HeadOfDepartment, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};
