import React from 'react';
import { Mail, Calendar, MapPin, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

const FacultyCard = ({ faculty, onDelete, onEdit }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all group relative overflow-hidden"
    >
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(faculty);
          }}
          className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
          title="Edit Faculty"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(faculty);
          }}
          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          title="Delete Faculty"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-zinc-100" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-zinc-200 group-hover:rotate-3 transition-transform">
            {faculty.FirstName[0]}{faculty.LastName[0]}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full uppercase tracking-widest border border-zinc-200">
              {faculty.DepartmentName}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {faculty.FirstName} {faculty.LastName}
          </h3>
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-tighter">{faculty.Designation}</p>
        </div>

        <div className="space-y-3 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-3 text-zinc-500 group/item">
            <div className="p-1.5 bg-zinc-50 rounded-md group-hover/item:bg-zinc-900 group-hover/item:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium truncate">{faculty.Email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-zinc-500 group/item">
            <div className="p-1.5 bg-zinc-50 rounded-md group-hover/item:bg-zinc-900 group-hover/item:text-white transition-colors">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium">Joined {new Date(faculty.HireDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <button className="w-full mt-6 py-2.5 bg-zinc-50 text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white transition-all">
          View Full Profile
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default FacultyCard;
