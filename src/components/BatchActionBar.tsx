import React from 'react';
import { Priority } from '../types/todo';
import { CheckCircle, Circle, Trash2, X, Flag } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchComplete: () => void;
  onBatchActivate: () => void;
  onBatchDelete: () => void;
  onBatchChangePriority: (priority: Priority) => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBatchComplete,
  onBatchActivate,
  onBatchDelete,
  onBatchChangePriority,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white rounded-xl shadow-2xl px-4 py-2.5 flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-slate-700 text-xs font-medium">
        <span className="font-mono tabular-nums text-indigo-400 font-bold">{selectedCount}</span>
        <span>selected</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <button
          type="button"
          onClick={onBatchComplete}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Complete</span>
        </button>

        <button
          type="button"
          onClick={onBatchActivate}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          <Circle className="w-3.5 h-3.5" />
          <span>Active</span>
        </button>

        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>Priority</span>
          </button>
          <div className="absolute bottom-full mb-1 left-0 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-lg p-1 shadow-lg min-w-[100px]">
            <button
              onClick={() => onBatchChangePriority('high')}
              className="px-2 py-1 text-left text-xs text-rose-400 hover:bg-slate-700 rounded"
            >
              High
            </button>
            <button
              onClick={() => onBatchChangePriority('medium')}
              className="px-2 py-1 text-left text-xs text-amber-400 hover:bg-slate-700 rounded"
            >
              Medium
            </button>
            <button
              onClick={() => onBatchChangePriority('low')}
              className="px-2 py-1 text-left text-xs text-slate-300 hover:bg-slate-700 rounded"
            >
              Low
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onBatchDelete}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors ml-1"
        aria-label="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
