import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedDept, 
  setSelectedDept, 
  departments 
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-2 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
        <input 
          type="text"
          placeholder="Search faculty by name, email, or expertise..."
          className="w-full pl-12 pr-10 py-3.5 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 ring-zinc-900 outline-none transition-all placeholder:text-zinc-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X className="w-3 h-3 text-zinc-500" />
          </button>
        )}
      </div>

      <div className="h-10 w-px bg-zinc-200 hidden lg:block mx-2" />

      <div className="flex items-center gap-3 px-2">
        <div className="flex items-center gap-2 text-zinc-400 px-2">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Department</span>
        </div>
        <select 
          className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 ring-zinc-900 transition-all cursor-pointer hover:bg-zinc-100"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">All Academic Units</option>
          {departments.map(dept => (
            <option key={dept.DepartmentID} value={dept.DepartmentID?.toString() || ''}>
              {dept.DepartmentName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
