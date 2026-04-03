import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  LogOut, 
  Settings, 
  Bell, 
  Search,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './Dashboard';
import DepartmentView from './DepartmentView';

const AdminPortal = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'departments', label: 'Departments', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-zinc-100 transition-all duration-300 flex flex-col z-[100] ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3 mb-8">
          <div className="bg-zinc-900 p-2 rounded-xl shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg tracking-tight whitespace-nowrap">Admin Console</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' 
                  : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'group-hover:text-zinc-900'}`} />
              {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-50 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all group">
            <Settings className="w-5 h-5 shrink-0 group-hover:text-zinc-900" />
            {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-widest">Settings</span>}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 transition-all group"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-100 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-50 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-zinc-400" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search resources..."
                className="bg-zinc-50 border border-zinc-100 rounded-xl pl-11 pr-4 py-2.5 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-50 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-zinc-100 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-zinc-900">Administrator</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Super User</p>
              </div>
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Dashboard />
                </motion.div>
              ) : (
                <motion.div
                  key="departments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <DepartmentView onBack={() => setActiveTab('dashboard')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
