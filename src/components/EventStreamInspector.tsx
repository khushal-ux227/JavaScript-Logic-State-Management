import React, { useState } from 'react';
import { DomEventLog, Task } from '../types/todo';
import { X, Terminal, Trash2, Copy, Check, HardDrive, RefreshCw } from 'lucide-react';
import { STORAGE_KEY } from '../utils/storage';

interface EventStreamInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DomEventLog[];
  onClearLogs: () => void;
  tasks: Task[];
  storageBytes: number;
}

export const EventStreamInspector: React.FC<EventStreamInspectorProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  tasks,
  storageBytes,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'state' | 'storage'>('events');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawStorage = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) || '[]' : '[]';

  return (
    <aside
      aria-label="DOM Event Delegation & State Inspector"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-200 shadow-2xl transition-all duration-300 max-h-[380px] flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>DOM & State Inspector</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Event Stream ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === 'state' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live State ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === 'storage' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              localStorage ({storageBytes} B)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'events' && (
            <button
              onClick={onClearLogs}
              title="Clear event logs"
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={() => {
              if (activeTab === 'events') handleCopy(JSON.stringify(logs, null, 2));
              else if (activeTab === 'state') handleCopy(JSON.stringify(tasks, null, 2));
              else handleCopy(rawStorage);
            }}
            title="Copy view to clipboard"
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ml-2"
            aria-label="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {activeTab === 'events' && (
          <div className="space-y-1.5">
            {logs.length === 0 ? (
              <div className="text-slate-500 py-6 text-center italic">
                No events captured yet. Click a task checkbox, add a task, or edit items to inspect delegated DOM events.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-1.5 hover:bg-slate-800/60 rounded border border-slate-800/50 transition-colors"
                >
                  <span className="text-slate-500 text-[11px] shrink-0">{log.timestamp}</span>
                  <span className="text-amber-400 shrink-0 font-semibold">{log.type.toUpperCase()}</span>
                  <span className="text-indigo-400 shrink-0">&lt;{log.targetTag.toLowerCase()}&gt;</span>
                  <span className="text-emerald-400 font-semibold shrink-0">
                    action: &quot;{log.action}&quot;
                  </span>
                  {log.taskId && (
                    <span className="text-slate-400 truncate max-w-[140px]">
                      id: {log.taskId}
                    </span>
                  )}
                  <span className="text-slate-300 truncate flex-1">{log.detail}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'state' && (
          <pre className="text-emerald-300 whitespace-pre-wrap leading-tight text-[11px]">
            {JSON.stringify(tasks, null, 2)}
          </pre>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-slate-300 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>Key: <code className="text-amber-300 font-mono">{STORAGE_KEY}</code></span>
              </div>
              <div>Size: <span className="text-emerald-400 font-bold">{storageBytes} bytes</span> (~{(storageBytes / 1024).toFixed(2)} KB)</div>
              <div>Items: <span className="text-indigo-400 font-bold">{tasks.length} tasks</span></div>
            </div>
            <pre className="text-slate-300 whitespace-pre-wrap leading-tight text-[11px] bg-slate-950 p-3 rounded border border-slate-800">
              {rawStorage}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
};
