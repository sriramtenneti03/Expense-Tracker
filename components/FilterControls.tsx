
import React from 'react';
import { Filters } from '../types';
import { CATEGORIES } from '../constants';

interface FilterControlsProps {
  filters: Filters;
  onFilterChange: (name: string, value: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange(e.target.name, e.target.value);
  };
  
  const handleReset = () => {
    onFilterChange('searchTerm', '');
    onFilterChange('category', '');
    onFilterChange('type', '');
    onFilterChange('startDate', '');
    onFilterChange('endDate', '');
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
        <div className="w-full">
          <label htmlFor="searchTerm" className="text-sm font-medium text-text-secondary block mb-1">Search</label>
          <input
            type="text"
            name="searchTerm"
            placeholder="Search by title..."
            value={filters.searchTerm}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"
          />
        </div>
        <div className="w-full">
          <label htmlFor="type" className="text-sm font-medium text-text-secondary block mb-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="category" className="text-sm font-medium text-text-secondary block mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-text-secondary block mb-1">Start Date</label>
              <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"/>
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-text-secondary block mb-1">End Date</label>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"/>
            </div>
        </div>
        <button 
          onClick={handleReset} 
          className="bg-gray-200 text-text-primary px-4 py-2 rounded-md hover:bg-gray-300 w-full xl:w-auto"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
