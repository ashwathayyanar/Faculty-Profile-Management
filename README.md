# FacultyPortal

A modern, full-stack Faculty Profile Management System designed for universities to seamlessly manage faculty profiles, department hierarchies, and academic records.

## Features

* **Dynamic Landing Page:** Real-time statistics on active faculty and departments.
* **Faculty Registration:** Streamlined onboarding process for new faculty members.
* **Admin Dashboard:** Comprehensive overview of university metrics.
* **Department Management:** Manage departments (CSE, ECE, Mechanical, IT, AIML, AIDS, Civil, Chemical, Biotechnology, etc.) and assign/update Department Heads.
* **Faculty Directory:** View, search, and manage faculty profiles across the institution.
* **Responsive Design:** Fully responsive UI built with Tailwind CSS and Framer Motion.

## Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide React
* **Backend:** Node.js, Express.js
* **Database:** SQLite (better-sqlite3)

## Prerequisites

* Node.js (v18 or higher recommended)
* npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd faculty-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

The project uses a unified development script that starts both the Express backend and the Vite frontend middleware.

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

* `/src`: React frontend source code (Pages, Components, Styles).
* `/backend`: Express server, API routes, and SQLite database configuration.
* `server.ts`: Main entry point for the backend and Vite middleware.
* `package.json`: Project dependencies and scripts.
