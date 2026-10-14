import React from 'react';
import { FilterCriteria, FilterStatus, TimeframeFilter, Priority, SortOption } from '../types/todo';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  filters: FilterCriteria;
  onFilterChange: (filters: Partial<FilterCriteria>) => void;
  categories: string[];
  counts: {
    all: number;
    active: number;
    completed: number;
    today: number;
    overdue: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  categories,
  counts,
}) => {
  const statusOptions: Array<{ id: FilterStatus; label: string; count: number }> = [
    { id: 'all', label: 'All Tasks', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="space-y-3">
      {/* Top Controls: Status Tabs & Search Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg shrink-0">
          {statusOptions.map((opt) => {
            const isActive = filters.status === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFilterChange({ status: opt.id })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span>{opt.label}</span>
                <span className="font-mono text-[11px] opacity-75 tabular-nums">
                  ({opt.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title, note, or category... (Press '/' to focus)"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full text-xs pl-8 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Filter & Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Quick Filters */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-medium">Timeline:</span>
            <select
              value={filters.timeframe}
              onChange={(e) => onFilterChange({ timeframe: e.target.value as TimeframeFilter })}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Due Today ({counts.today})</option>
              <option value="upcoming">Upcoming</option>
              <option value="overdue">Overdue ({counts.overdue})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value as 'all' | Priority })}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="due-asc">Due Date (Earliest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="title-asc">Title (A &rarr; Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
