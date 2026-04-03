import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.POSTGRES_URL ? { rejectUnauthorized: false } : false
});

/**
 * Initialize the database schema and seed data
 */
export const initDB = async () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS Departments (
        DepartmentID SERIAL PRIMARY KEY,
        DepartmentName TEXT NOT NULL UNIQUE,
        HeadOfDepartment TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Faculty (
        FacultyID SERIAL PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Designation TEXT NOT NULL,
        DepartmentID INTEGER,
        HireDate DATE NOT NULL,
        FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS Publications (
        PublicationID SERIAL PRIMARY KEY,
        FacultyID INTEGER NOT NULL,
        Title TEXT NOT NULL,
        PublishedYear INTEGER NOT NULL,
        FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
    );
  `;

  try {
    await pool.query(schema);

    // Check if data exists, if not, seed it
    const deptCountResult = await pool.query('SELECT COUNT(*) as count FROM Departments');
    const count = parseInt(deptCountResult.rows[0].count, 10);
    
    if (count === 0) {
      console.log('Seeding initial data...');
      
      // Seed Departments
      const depts = [
        ['Computer Science and Engineering (CSE)', 'Dr. Alan Turing'],
        ['Electronics and Communication Engineering (ECE)', 'Dr. Guglielmo Marconi'],
        ['Electrical and Electronics Engineering (EEE)', 'Dr. Nikola Tesla'],
        ['Mechanical Engineering', 'Dr. James Watt'],
        ['Information Technology (IT)', 'Dr. Tim Berners-Lee'],
        ['Artificial Intelligence and Machine Learning (AIML)', 'Dr. John McCarthy'],
        ['Artificial Intelligence and Data Science (AIDS)', 'Dr. Geoffrey Hinton'],
        ['Civil Engineering', 'Dr. Visvesvaraya'],
        ['Chemical Engineering', 'Dr. Fritz Haber'],
        ['Biotechnology', 'Dr. Louis Pasteur']
      ];
      
      for (const dept of depts) {
        await pool.query('INSERT INTO Departments (DepartmentName, HeadOfDepartment) VALUES ($1, $2)', dept);
      }

      // Seed Faculty
      const facultyData = [
        ['John', 'Doe', 'john.doe@university.edu', 'Professor', 1, '2015-08-20'],
        ['Jane', 'Smith', 'jane.smith@university.edu', 'Associate Professor', 2, '2016-01-15'],
        ['Robert', 'Brown', 'robert.b@university.edu', 'Assistant Professor', 3, '2018-09-10'],
        ['Emily', 'Davis', 'emily.d@university.edu', 'Professor', 4, '2012-03-05'],
        ['Michael', 'Wilson', 'michael.w@university.edu', 'Lecturer', 5, '2020-11-12']
      ];
      
      for (const row of facultyData) {
        await pool.query('INSERT INTO Faculty (FirstName, LastName, Email, Designation, DepartmentID, HireDate) VALUES ($1, $2, $3, $4, $5, $6)', row);
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

export default pool;
