import pool from '../config/db.js';
import { Request, Response } from 'express';

/**
 * Controller for Faculty-related operations
 */

// 1. Fetch all faculty with Department Names (SQL JOIN)
export const getAllFaculty = async (req: Request, res: Response) => {
  try {
    const { deptId } = req.query;
    
    let query = `
      SELECT f.*, d.DepartmentName 
      FROM Faculty f
      LEFT JOIN Departments d ON f.DepartmentID = d.DepartmentID
    `;
    
    const params: any[] = [];
    
    if (deptId) {
      params.push(deptId);
      query += ` WHERE f.DepartmentID = $${params.length}`;
    }
    
    query += ' ORDER BY f.LastName ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch faculty', details: error.message });
  }
};

// 2. Add a new faculty member with robust error handling
export const addFaculty = async (req: Request, res: Response) => {
  const { FirstName, LastName, Email, Designation, DepartmentID, HireDate } = req.body;

  // Basic Validation
  if (!FirstName || !LastName || !Email || !Designation || !DepartmentID || !HireDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = `
      INSERT INTO Faculty (FirstName, LastName, Email, Designation, DepartmentID, HireDate)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING FacultyID
    `;
    
    const result = await pool.query(query, [FirstName, LastName, Email, Designation, DepartmentID, HireDate]);
    
    res.status(201).json({ 
      message: 'Faculty member added successfully', 
      id: result.rows[0].facultyid 
    });
  } catch (error: any) {
    // Handle Duplicate Email Error (Postgres error code for unique constraint is 23505)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A faculty member with this email already exists' });
    }
    
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// 3. Get faculty by ID (useful for profile views)
export const getFacultyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const facultyResult = await pool.query(`
      SELECT f.*, d.DepartmentName 
      FROM Faculty f
      LEFT JOIN Departments d ON f.DepartmentID = d.DepartmentID
      WHERE f.FacultyID = $1
    `, [id]);

    if (facultyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    const publicationsResult = await pool.query('SELECT * FROM Publications WHERE FacultyID = $1', [id]);
    
    res.json({ ...facultyResult.rows[0], publications: publicationsResult.rows });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// 4. Delete faculty member
export const deleteFaculty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Faculty WHERE FacultyID = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// 5. Update faculty member
export const updateFaculty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { FirstName, LastName, Email, Designation, DepartmentID, HireDate } = req.body;

  if (!FirstName || !LastName || !Email || !Designation || !DepartmentID || !HireDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = `
      UPDATE Faculty 
      SET FirstName = $1, LastName = $2, Email = $3, Designation = $4, DepartmentID = $5, HireDate = $6
      WHERE FacultyID = $7
    `;
    
    const result = await pool.query(query, [FirstName, LastName, Email, Designation, DepartmentID, HireDate, id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    
    res.json({ message: 'Faculty member updated successfully' });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A faculty member with this email already exists' });
    }
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};
