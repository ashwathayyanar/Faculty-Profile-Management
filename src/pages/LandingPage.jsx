import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, ArrowRight, GraduationCap, Building2, LayoutDashboard } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [stats, setStats] = useState({ facultyCount: 0, deptCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 p-2 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FacultyPortal</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Next Generation Academic Management
            </div>
            <h1 className="text-7xl font-bold leading-[1.1] tracking-tight mb-8">
              Seamless <br />
              <span className="text-zinc-400 italic font-serif font-light">Academic</span> <br />
              Operations.
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-lg mb-12 font-light">
              The professional SaaS solution for universities to manage faculty profiles, department hierarchies, and academic records with precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('register')}
                className="group flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('admin')}
                className="flex items-center justify-center gap-3 bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all"
              >
                Dashboard
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-zinc-50 rounded-[3rem] p-8 border border-zinc-100 shadow-inner">
              <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-zinc-100">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-2 w-32 bg-zinc-100 rounded-full" />
                </div>
                
                <div className="space-y-6">
                  <div className="h-12 w-full bg-zinc-50 rounded-xl animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-zinc-50 rounded-2xl animate-pulse" />
                    <div className="h-32 bg-zinc-50 rounded-2xl animate-pulse" />
                  </div>
                  <div className="h-48 w-full bg-zinc-50 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-zinc-100 flex items-center gap-4"
            >
              <div className="bg-blue-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Faculty</p>
                <p className="text-xl font-bold">{stats.facultyCount}</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-zinc-100 flex items-center gap-4"
            >
              <div className="bg-purple-50 p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Departments</p>
                <p className="text-xl font-bold">{stats.deptCount} Units</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Portal Options */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => onNavigate('register')}
            className="group relative bg-zinc-50 rounded-[2.5rem] p-12 text-left hover:bg-zinc-900 hover:text-white transition-all duration-500 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="bg-white group-hover:bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors">
                <UserPlus className="w-8 h-8 text-zinc-900 group-hover:text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Register Faculty</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400 text-lg font-light leading-relaxed max-w-xs">
                Join our academic community by registering your professional profile.
              </p>
              <div className="mt-8 flex items-center gap-2 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                Start Registration <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute top-0 right-0 opacity-5 translate-x-1/4 -translate-y-1/4 pointer-events-none">
              <UserPlus className="w-64 h-64" />
            </div>
          </button>

          <button 
            onClick={() => onNavigate('admin')}
            className="group relative bg-zinc-50 rounded-[2.5rem] p-12 text-left hover:bg-zinc-900 hover:text-white transition-all duration-500 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="bg-white group-hover:bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors">
                <ShieldCheck className="w-8 h-8 text-zinc-900 group-hover:text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Admin Portal</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400 text-lg font-light leading-relaxed max-w-xs">
                Access the dashboard to manage faculty, departments, and system settings.
              </p>
              <div className="mt-8 flex items-center gap-2 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                Enter Portal <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute top-0 right-0 opacity-5 translate-x-1/4 -translate-y-1/4 pointer-events-none">
              <LayoutDashboard className="w-64 h-64" />
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight uppercase">FacultyPortal SaaS</span>
          </div>
          <p className="text-zinc-400 text-xs uppercase tracking-widest">© 2026 Academic Systems Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper icon import for the component
import { UserPlus } from 'lucide-react';

export default LandingPage;
