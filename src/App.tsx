import React, { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import FacultyRegistration from './pages/FacultyRegistration.jsx';
import AdminPortal from './pages/AdminPortal.jsx';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing', 'register', 'admin'

  return (
    <div className="min-h-screen bg-white selection:bg-zinc-900 selection:text-white">
      {view === 'landing' && (
        <LandingPage onNavigate={(target) => setView(target)} />
      )}
      
      {view === 'register' && (
        <FacultyRegistration onBack={() => setView('landing')} />
      )}
      
      {view === 'admin' && (
        <AdminPortal onLogout={() => setView('landing')} />
      )}
    </div>
  );
}
