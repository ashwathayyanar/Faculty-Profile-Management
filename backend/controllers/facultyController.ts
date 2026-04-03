import db from '../config/db.ts';
import { Request, Response } from 'express';

/**
 * Controller for Faculty-related operations
 */

// 1. Fetch all faculty with Department Names (SQL JOIN)
export const getAllFaculty = (req: Request, res: Response) => {
  try {
    const { deptId } = req.query;
    
    let query = `
      SELECT f.*, d.DepartmentName 
      FROM Faculty f
      LEFT JOIN Departments d ON f.DepartmentID = d.DepartmentID
    `;
    
    const params: any[] = [];
    
    if (deptId) {
      query += ' WHERE f.DepartmentID = ?';
      params.push(deptId);
    }
    
    query += ' ORDER BY f.LastName ASC';
    
    const faculty = db.prepare(query).all(...params);
    res.json(faculty);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch faculty', details: error.message });
  }
};

// 2. Add a new faculty member with robust error handling
export const addFaculty = (req: Request, res: Response) => {
  const { FirstName, LastName, Email, Designation, DepartmentID, HireDate } = req.body;

  // Basic Validation
  if (!FirstName || !LastName || !Email || !Designation || !DepartmentID || !HireDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const insert = db.prepare(`
      INSERT INTO Faculty (FirstName, LastName, Email, Designation, DepartmentID, HireDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(FirstName, LastName, Email, Designation, DepartmentID, HireDate);
    
    res.status(201).json({ 
      message: 'Faculty member added successfully', 
      id: result.lastInsertRowid 
    });
  } catch (error: any) {
    // Handle Duplicate Email Error (SQLite error code for unique constraint)
    if (error.message.includes('UNIQUE constraint failed: Faculty.Email')) {
      return res.status(409).json({ error: 'A faculty member with this email already exists' });
    }
    
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// 3. Get faculty by ID (useful for profile views)
export const getFacultyById = (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const faculty = db.prepare(`
      SELECT f.*, d.DepartmentName 
      FROM Faculty f
      LEFT JOIN Departments d ON f.DepartmentID = d.DepartmentID
      WHERE f.FacultyID = ?
    `).get(id);

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    const publications = db.prepare('SELECT * FROM Publications WHERE FacultyID = ?').all(id);
    
    res.json({ ...faculty, publications });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// 4. Delete faculty member
export const deleteFaculty = (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM Faculty WHERE FacultyID = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// 5. Update faculty member
export const updateFaculty = (req: Request, res: Response) => {
  const { id } = req.params;
  const { FirstName, LastName, Email, Designation, DepartmentID, HireDate } = req.body;

  if (!FirstName || !LastName || !Email || !Designation || !DepartmentID || !HireDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const update = db.prepare(`
      UPDATE Faculty 
      SET FirstName = ?, LastName = ?, Email = ?, Designation = ?, DepartmentID = ?, HireDate = ?
      WHERE FacultyID = ?
    `);
    
    const result = update.run(FirstName, LastName, Email, Designation, DepartmentID, HireDate, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    
    res.json({ message: 'Faculty member updated successfully' });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed: Faculty.Email')) {
      return res.status(409).json({ error: 'A faculty member with this email already exists' });
    }
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};
