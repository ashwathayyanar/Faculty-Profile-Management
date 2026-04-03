import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserPlus, ArrowLeft, CheckCircle2, Loader2, GraduationCap } from 'lucide-react';

const FacultyRegistration = ({ onBack }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Designation: 'Assistant Professor',
    DepartmentID: '',
    HireDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      console.log('Fetched departments:', data);
      setDepartments(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, DepartmentID: data[0].departmentid }));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-zinc-100"
        >
          <div className="bg-green-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Successful</h2>
          <p className="text-zinc-500 mb-12 font-light leading-relaxed">
            Your professional profile has been added to our academic database. You can now access the portal.
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12 font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 p-3 rounded-2xl w-fit mb-8">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6">Join the <br /> <span className="text-zinc-400">Academic Network</span></h1>
            <p className="text-zinc-500 text-lg font-light leading-relaxed mb-12">
              Register your professional profile to join our distinguished faculty directory. Manage your academic records with ease.
            </p>
            
            <div className="space-y-6">
              {[
                'Centralized Profile Management',
                'Departmental Integration',
                'Secure Academic Records',
                'Professional Networking'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.FirstName}
                      onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      placeholder="e.g. Alan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.LastName}
                      onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      placeholder="e.g. Turing"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.Email}
                    onChange={(e) => setFormData({...formData, Email: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    placeholder="alan.turing@university.edu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Designation</label>
                    <select 
                      required
                      value={formData.Designation}
                      onChange={(e) => setFormData({...formData, Designation: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
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
                      value={formData.DepartmentID}
                      onChange={(e) => setFormData({...formData, DepartmentID: parseInt(e.target.value)})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    >
                      <option value="" disabled>Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.departmentid} value={dept.departmentid}>{dept.departmentname}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Hire Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.HireDate}
                    onChange={(e) => setFormData({...formData, HireDate: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Registration'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegistration;
