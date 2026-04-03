import db from '../config/db.ts';
import { Request, Response } from 'express';

/**
 * Controller for Department-related operations
 */
export const getAllDepartments = (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        d.*,
        (SELECT COUNT(*) FROM Faculty WHERE DepartmentID = d.DepartmentID) as facultyCount
      FROM Departments d
      ORDER BY d.DepartmentName ASC
    `;
    const departments = db.prepare(query).all();
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
  }
};

export const updateDepartment = (req: Request, res: Response) => {
  const { id } = req.params;
  const { HeadOfDepartment } = req.body;

  if (!HeadOfDepartment) {
    return res.status(400).json({ error: 'Head of Department is required' });
  }

  try {
    const update = db.prepare('UPDATE Departments SET HeadOfDepartment = ? WHERE DepartmentID = ?');
    const result = update.run(HeadOfDepartment, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};
