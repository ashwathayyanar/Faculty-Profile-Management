import React, { useState, useEffect } from 'react';
import { Building2, Users, Loader2, Edit2, X, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DepartmentView = ({ onBack }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDept, setEditingDept] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHead = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/departments/${editingDept.DepartmentID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ HeadOfDepartment: editingDept.HeadOfDepartment })
      });
      if (res.ok) {
        setStats(prev => prev.map(d => d.DepartmentID === editingDept.DepartmentID ? editingDept : d));
        setEditingDept(null);
      } else {
        alert('Failed to update department head');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
        <Loader2 className="w-10 h-10 animate-spin mb-6 text-zinc-900" />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em]">Analyzing Departmental Structures</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </button>
          <div>
            <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-1">Departmental Analysis</h2>
            <p className="text-zinc-500 font-light text-sm">Comprehensive overview of academic units and leadership.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((dept, i) => (
          <motion.div
            key={dept.DepartmentID}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full -mr-12 -mt-12 transition-colors group-hover:bg-zinc-100" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-zinc-900 p-4 rounded-2xl shadow-lg shadow-zinc-200">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <button 
                  onClick={() => setEditingDept(dept)}
                  className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 mb-6 leading-tight min-h-[3.5rem]">
                {dept.DepartmentName}
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Faculty</span>
                  </div>
                  <span className="text-xl font-bold text-zinc-900">{dept.facultyCount}</span>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Head of Department</p>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    {dept.HeadOfDepartment}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Head Modal */}
      <AnimatePresence>
        {editingDept && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setEditingDept(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative z-10 border border-zinc-200"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <button onClick={() => setEditingDept(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Update Leadership</h3>
              <p className="text-zinc-500 text-sm mb-8">Modify the Head of Department for {editingDept.DepartmentName}.</p>

              <form onSubmit={handleUpdateHead} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Head of Department Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingDept.HeadOfDepartment}
                    onChange={(e) => setEditingDept({...editingDept, HeadOfDepartment: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingDept(null)}
                    disabled={isUpdating}
                    className="flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-4 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Head'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentView;
