import React, { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '../types/todo';
import {
  Check,
  Calendar,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Plus,
  X,
  CheckSquare,
  Square,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string, eventPos?: { x: number; y: number }) => void;
  onDelete: (taskId: string) => void;
  onUpdateTitle: (taskId: string, newTitle: string) => void;
  onUpdatePriority: (taskId: string, priority: Priority) => void;
  onUpdateDueDate: (taskId: string, dueDate?: string) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onLogDomEvent: (action: string, taskId: string, detail: string, tag: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  onSelect,
  onToggleComplete,
  onDelete,
  onUpdateTitle,
  onUpdatePriority,
  onUpdateDueDate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onLogDomEvent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
      onLogDomEvent('save-edit', task.id, `Title changed to: "${trimmed}"`, 'INPUT');
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
    onLogDomEvent('cancel-edit', task.id, 'Edit cancelled without saving', 'BUTTON');
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubtaskTitle.trim();
    if (trimmed) {
      onAddSubtask(task.id, trimmed);
      onLogDomEvent('add-subtask', task.id, `Added subtask: "${trimmed}"`, 'FORM');
      setNewSubtaskTitle('');
      setShowSubtaskInput(false);
    }
  };

  // Due date status formatting
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = task.dueDate < today && !task.completed;
    const isDueToday = task.dueDate === today && !task.completed;

    const [year, month, day] = task.dueDate.split('-');
    const formatted = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      text: formatted,
      isOverdue,
      isDueToday,
    };
  };

  const dueDateInfo = getDueDateStatus();
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <li
      data-task-id={task.id}
      data-action="task-container"
      className={`group relative rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-80'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      } ${isSelected ? 'ring-2 ring-indigo-500/50 border-indigo-300' : ''}`}
    >
      <div className="p-4 flex items-start gap-3.5">
        {/* Multi-select checkbox */}
        <button
          type="button"
          data-action="select-item"
          data-task-id={task.id}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(task.id);
            onLogDomEvent('select-item', task.id, `Task selection toggled (${!isSelected})`, 'BUTTON');
          }}
          className="mt-0.5 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
          aria-label={isSelected ? 'Deselect task' : 'Select task'}
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>

        {/* Complete Toggle Checkbox */}
        <button
          type="button"
          data-action="toggle-complete"
          data-task-id={task.id}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            onToggleComplete(task.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            onLogDomEvent('toggle-complete', task.id, `Status toggled to: ${!task.completed}`, 'BUTTON');
          }}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
            task.completed
              ? 'bg-emerald-600 text-white border border-emerald-600'
              : 'border border-slate-300 dark:border-slate-600 hover:border-indigo-600 hover:bg-indigo-50/30'
          }`}
          aria-label={task.completed ? 'Mark task as active' : 'Mark task as complete'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {/* Main Title Row */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={editInputRef}
                type="text"
                data-action="input-edit-title"
                data-task-id={task.id}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="w-full text-sm font-medium px-2 py-1 border border-indigo-500 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                data-action="save-edit"
                data-task-id={task.id}
                onClick={handleSaveEdit}
                className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                type="button"
                data-action="cancel-edit"
                data-task-id={task.id}
                onClick={handleCancelEdit}
                className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onDoubleClick={() => {
                setIsEditing(true);
                onLogDomEvent('double-click-edit', task.id, 'Double click triggered inline edit', 'SPAN');
              }}
            >
              <span
                className={`text-sm font-medium block truncate ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
                title={task.title}
              >
                {task.title}
              </span>

              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          )}

          {/* Zero-Pill Unboxed Metadata Row */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {task.category}
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            {/* Priority Indicator with text label */}
            <span
              className={`font-medium ${
                task.priority === 'high'
                  ? 'text-rose-600 dark:text-rose-400'
                  : task.priority === 'medium'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.priority === 'high' && 'High Priority'}
              {task.priority === 'medium' && 'Medium Priority'}
              {task.priority === 'low' && 'Low Priority'}
            </span>

            {dueDateInfo && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span
                  className={`flex items-center gap-1 tabular-nums ${
                    dueDateInfo.isOverdue
                      ? 'text-rose-600 font-semibold'
                      : dueDateInfo.isDueToday
                      ? 'text-amber-600 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  {dueDateInfo.isOverdue ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {dueDateInfo.isOverdue ? `Overdue (${dueDateInfo.text})` : dueDateInfo.isDueToday ? 'Due Today' : `Due ${dueDateInfo.text}`}
                  </span>
                </span>
              </>
            )}

            {task.subtasks.length > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  type="button"
                  data-action="toggle-subtask-view"
                  data-task-id={task.id}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hover:text-indigo-600 flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>
                    {completedSubtasks}/{task.subtasks.length} subtasks
                  </span>
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            data-action="toggle-expand"
            data-task-id={task.id}
            onClick={() => {
              setIsExpanded(!isExpanded);
              onLogDomEvent('toggle-subtasks', task.id, `Toggled subtasks visibility (${!isExpanded})`, 'BUTTON');
            }}
            title="Subtasks & details"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            data-action="start-edit"
            data-task-id={task.id}
            onClick={() => {
              setIsEditing(true);
              onLogDomEvent('start-edit', task.id, 'Initiated inline edit title', 'BUTTON');
            }}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 rounded-md transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-action="delete-task"
            data-task-id={task.id}
            onClick={() => {
              onDelete(task.id);
              onLogDomEvent('delete-task', task.id, 'Removed task from state and storage', 'BUTTON');
            }}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/50 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Subtasks & Details Section */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 rounded-b-xl space-y-3">
          {/* Quick Subtask Management */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
              <span>Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
              {!showSubtaskInput && (
                <button
                  type="button"
                  data-action="open-add-subtask"
                  data-task-id={task.id}
                  onClick={() => setShowSubtaskInput(true)}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Subtask</span>
                </button>
              )}
            </div>

            {/* Subtasks List */}
            {task.subtasks.length > 0 ? (
              <ul className="space-y-1.5 mt-2">
                {task.subtasks.map((subtask) => (
                  <li
                    key={subtask.id}
                    data-action="subtask-row"
                    data-subtask-id={subtask.id}
                    data-task-id={task.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                      <input
                        type="checkbox"
                        data-action="toggle-subtask"
                        data-task-id={task.id}
                        data-subtask-id={subtask.id}
                        checked={subtask.completed}
                        onChange={() => {
                          onToggleSubtask(task.id, subtask.id);
                          onLogDomEvent('toggle-subtask', task.id, `Subtask "${subtask.title}" completion: ${!subtask.completed}`, 'INPUT');
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span
                        className={`text-xs truncate ${
                          subtask.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </label>

                    <button
                      type="button"
                      data-action="delete-subtask"
                      data-task-id={task.id}
                      data-subtask-id={subtask.id}
                      onClick={() => {
                        onDeleteSubtask(task.id, subtask.id);
                        onLogDomEvent('delete-subtask', task.id, `Removed subtask "${subtask.title}"`, 'BUTTON');
                      }}
                      className="text-slate-400 hover:text-rose-500 p-0.5 rounded"
                      title="Delete subtask"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !showSubtaskInput && (
                <p className="text-xs text-slate-400 italic">No subtasks yet. Break this task into smaller steps.</p>
              )
            )}

            {/* Add Subtask Input Form */}
            {showSubtaskInput && (
              <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Enter subtask title..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  autoFocus
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubtaskInput(false)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Quick Metadata Modification */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Priority:</span>
              <select
                value={task.priority}
                onChange={(e) => {
                  const p = e.target.value as Priority;
                  onUpdatePriority(task.id, p);
                  onLogDomEvent('change-priority', task.id, `Priority updated to ${p}`, 'SELECT');
                }}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Due Date:</span>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => {
                  const val = e.target.value || undefined;
                  onUpdateDueDate(task.id, val);
                  onLogDomEvent('change-due-date', task.id, `Due date set to ${val || 'none'}`, 'INPUT');
                }}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
