import React from 'react';
import { GraduationCap, LayoutDashboard, Building2, UserPlus } from 'lucide-react';

const Navbar = ({ onAddClick, onViewChange, currentView }) => {
  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900 leading-none">FacultyPortal</h1>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Management System</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-2 text-sm font-medium transition-all pb-1 border-b-2 ${currentView === 'dashboard' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-900'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => onViewChange('departments')}
              className={`flex items-center gap-2 text-sm font-medium transition-all pb-1 border-b-2 ${currentView === 'departments' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent hover:text-zinc-900'}`}
            >
              <Building2 className="w-4 h-4" />
              Departments
            </button>
          </div>

          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add Faculty
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
