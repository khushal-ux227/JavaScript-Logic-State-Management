import React, { useState } from 'react';
import { Priority } from '../types/todo';
import { Plus, Calendar, Tag, AlertCircle, ChevronDown, ListPlus } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../utils/storage';

interface TaskInputProps {
  onAddTask: (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    subtasks?: string[];
  }) => void;
  categories: string[];
  onLogDomEvent: (action: string, taskId: string, detail: string, tag: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  categories,
  onLogDomEvent,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [pendingSubtasks, setPendingSubtasks] = useState<string[]>([]);

  const handleAddPendingSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskInput.trim()) {
      setPendingSubtasks([...pendingSubtasks, subtaskInput.trim()]);
      setSubtaskInput('');
    }
  };

  const handleRemovePendingSubtask = (index: number) => {
    setPendingSubtasks(pendingSubtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask({
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDate || undefined,
      subtasks: pendingSubtasks.length > 0 ? pendingSubtasks : undefined,
    });

    onLogDomEvent('create-task', 'new', `Created: "${trimmedTitle}" [${priority}, ${category}]`, 'BUTTON');

    // Reset fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setPendingSubtasks([]);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-all">
      <form onSubmit={handleSubmit} className="p-3.5 space-y-3">
        {/* Main Input Row */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </div>

          <input
            type="text"
            placeholder="Add a new task... (press Enter to create)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-sm bg-transparent border-0 focus:outline-hidden placeholder:text-slate-400 text-slate-900 dark:text-slate-100 font-normal"
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isExpanded || description || pendingSubtasks.length > 0
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Add details, notes & subtasks"
            >
              <ListPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Details</span>
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              data-action="create-task"
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Quick Attribute Selectors (Always visible or in compact row) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Priority selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-md border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-md border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Due date picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-md border border-slate-200/70 dark:border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-slate-400 hover:text-slate-600 text-xs ml-1"
                title="Clear date"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Detailed Drawer (Notes & Subtasks) */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Description / Notes
              </label>
              <textarea
                placeholder="Add context, documentation, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Subtasks checklist
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Subtask step..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPendingSubtask(e);
                    }
                  }}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddPendingSubtask}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md"
                >
                  Add Step
                </button>
              </div>

              {pendingSubtasks.length > 0 && (
                <ul className="space-y-1">
                  {pendingSubtasks.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between text-xs px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <span>{step}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingSubtask(idx)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
