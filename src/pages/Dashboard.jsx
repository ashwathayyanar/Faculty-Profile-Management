import React, { useState, useEffect } from 'react';
import { Users, Loader2, UserPlus, X, AlertCircle, CheckCircle2, Building2, BookOpen, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FacultyCard from '../components/FacultyCard.jsx';
import SearchFilter from '../components/SearchFilter.jsx';

const Dashboard = ({ forceRefresh }) => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [globalStats, setGlobalStats] = useState({ facultyCount: 0, deptCount: 0, pubCount: 0, researchScore: '0.0' });
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete State
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit State
  const [facultyToEdit, setFacultyToEdit] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
    fetchDepartments();
    fetchGlobalStats();
  }, [selectedDept, forceRefresh]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = selectedDept 
        ? `/api/faculty?deptId=${selectedDept}` 
        : '/api/faculty';
      const res = await fetch(url);
      const data = await res.json();
      setFaculty(data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setGlobalStats(data);
    } catch (error) {
      console.error('Error fetching global stats:', error);
    }
  };

  const handleDelete = async () => {
    if (!facultyToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/faculty/${facultyToDelete.FacultyID}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFaculty(prev => prev.filter(f => f.FacultyID !== facultyToDelete.FacultyID));
        setFacultyToDelete(null);
        fetchGlobalStats(); // Refresh stats after delete
      } else {
        alert('Failed to delete faculty member');
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!facultyToEdit) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/faculty/${facultyToEdit.FacultyID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyToEdit)
      });
      if (res.ok) {
        setFaculty(prev => prev.map(f => f.FacultyID === facultyToEdit.FacultyID ? facultyToEdit : f));
        setFacultyToEdit(null);
        fetchGlobalStats();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update faculty member');
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const fullName = `${f.FirstName} ${f.LastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           f.Email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-zinc-200">
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Admin Dashboard
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
            Manage <br /> <span className="text-zinc-400 italic font-serif font-light">Academic</span> Records.
          </h2>
          <p className="text-zinc-400 text-xl font-light leading-relaxed max-w-lg">
            A centralized SaaS hub for academic excellence. Manage faculty profiles, departmental hierarchies, and system operations with precision.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-5 translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <Users className="w-[40rem] h-[40rem]" />
        </div>
      </div>

      {/* High-Impact Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Total Faculty Members', value: globalStats.facultyCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Academic Departments', value: globalStats.deptCount, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all border-b-4 border-b-zinc-900/5"
          >
            <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{stat.label}</p>
              <p className="text-4xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Controls */}
      <SearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        departments={departments}
      />

      {/* Faculty Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
          <Loader2 className="w-10 h-10 animate-spin mb-6 text-zinc-900" />
          <p className="font-mono text-[10px] uppercase tracking-[0.4em]">Synchronizing Academic Records</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredFaculty.map((f) => (
              <FacultyCard 
                key={f.FacultyID} 
                faculty={f} 
                onDelete={(faculty) => setFacultyToDelete(faculty)}
                onEdit={(faculty) => setFacultyToEdit(faculty)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Faculty Modal */}
      <AnimatePresence>
        {facultyToEdit && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setFacultyToEdit(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl relative z-10 border border-zinc-200 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-500" />
                </div>
                <button onClick={() => setFacultyToEdit(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Edit Faculty Profile</h3>
              <p className="text-zinc-500 text-sm mb-8">Update the academic and personal details for this faculty member.</p>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={facultyToEdit.FirstName}
                      onChange={(e) => setFacultyToEdit({...facultyToEdit, FirstName: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={facultyToEdit.LastName}
                      onChange={(e) => setFacultyToEdit({...facultyToEdit, LastName: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={facultyToEdit.Email}
                    onChange={(e) => setFacultyToEdit({...facultyToEdit, Email: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Designation</label>
                    <select 
                      required
                      value={facultyToEdit.Designation}
                      onChange={(e) => setFacultyToEdit({...facultyToEdit, Designation: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all appearance-none"
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Lecturer">Lecturer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Department</label>
                    <select 
                      required
                      value={facultyToEdit.DepartmentID}
                      onChange={(e) => setFacultyToEdit({...facultyToEdit, DepartmentID: parseInt(e.target.value)})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all appearance-none"
                    >
                      {departments.map(dept => (
                        <option key={dept.DepartmentID} value={dept.DepartmentID}>{dept.DepartmentName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Hire Date</label>
                  <input 
                    type="date" 
                    required
                    value={facultyToEdit.HireDate}
                    onChange={(e) => setFacultyToEdit({...facultyToEdit, HireDate: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setFacultyToEdit(null)}
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
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {facultyToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setFacultyToDelete(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative z-10 border border-zinc-200"
            >
              <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Confirm Deletion</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Are you sure you want to remove <span className="font-bold text-zinc-900">{facultyToDelete.FirstName} {facultyToDelete.LastName}</span> from the system? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setFacultyToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Delete Profile'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!loading && filteredFaculty.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200"
        >
          <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Users className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-500 font-serif italic text-2xl">No academic profiles match your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedDept('');}}
            className="mt-4 text-sm font-bold text-zinc-900 underline underline-offset-4"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
