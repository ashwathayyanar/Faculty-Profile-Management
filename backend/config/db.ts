import Database from 'better-sqlite3';
import path from 'path';

// Initialize the database connection
const db = new Database('faculty_system.db', { verbose: console.log });

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

/**
 * Initialize the database schema and seed data
 */
export const initDB = () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS Departments (
        DepartmentID INTEGER PRIMARY KEY AUTOINCREMENT,
        DepartmentName TEXT NOT NULL UNIQUE,
        HeadOfDepartment TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Faculty (
        FacultyID INTEGER PRIMARY KEY AUTOINCREMENT,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Designation TEXT NOT NULL,
        DepartmentID INTEGER,
        HireDate DATE NOT NULL,
        FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS Publications (
        PublicationID INTEGER PRIMARY KEY AUTOINCREMENT,
        FacultyID INTEGER NOT NULL,
        Title TEXT NOT NULL,
        PublishedYear INTEGER NOT NULL,
        FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
    );
  `;

  db.exec(schema);

  // Check if data exists, if not, seed it
  const deptCount = db.prepare('SELECT COUNT(*) as count FROM Departments').get() as { count: number };
  if (deptCount.count === 0) {
    console.log('Seeding initial data...');
    
    // Seed Departments
    const insertDept = db.prepare('INSERT INTO Departments (DepartmentName, HeadOfDepartment) VALUES (?, ?)');
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
    depts.forEach(dept => insertDept.run(...dept));

    // Seed Faculty
    const insertFaculty = db.prepare('INSERT INTO Faculty (FirstName, LastName, Email, Designation, DepartmentID, HireDate) VALUES (?, ?, ?, ?, ?, ?)');
    const facultyData = [
      ['John', 'Doe', 'john.doe@university.edu', 'Professor', 1, '2015-08-20'],
      ['Jane', 'Smith', 'jane.smith@university.edu', 'Associate Professor', 2, '2016-01-15'],
      ['Robert', 'Brown', 'robert.b@university.edu', 'Assistant Professor', 3, '2018-09-10'],
      ['Emily', 'Davis', 'emily.d@university.edu', 'Professor', 4, '2012-03-05'],
      ['Michael', 'Wilson', 'michael.w@university.edu', 'Lecturer', 5, '2020-11-12']
    ];
    facultyData.forEach(row => insertFaculty.run(...row));

    // No publications seeded as requested to remove them
  }
};

export default db;
