import React, { useState } from 'react';
import { X, Play, BookOpen, Layers, Zap, Database, CheckCircle2, ArrowRight, Code2 } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateAction?: (actionName: string) => void;
}

const CHAPTERS = [
  {
    id: 'dom-creation',
    title: '1. Dynamic DOM Manipulation',
    icon: Layers,
    badge: 'Core DOM',
    summary: 'How tasks are generated as real DOM nodes dynamically without page reloads.',
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          In traditional browser JavaScript, dynamic interfaces construct new DOM nodes imperatively via{' '}
          <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded text-xs">document.createElement()</code> or declaratively through modern view reconciliation engines.
        </p>

        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
          <div className="text-slate-400">// Dynamic DOM Element Instantiation:</div>
          <div>const taskEl = document.createElement(&apos;li&apos;);</div>
          <div>taskEl.className = &apos;task-item flex items-center&apos;;</div>
          <div>taskEl.dataset.taskId = task.id;</div>
          <div>taskEl.dataset.action = &apos;select-task&apos;;</div>
          <div>taskEl.innerHTML = `&lt;span&gt;${'{task.title}'}&lt;/span&gt;`;</div>
          <div>container.appendChild(taskEl);</div>
        </div>

        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
          <h4 className="font-semibold text-slate-900 text-xs mb-1">Key Takeaway</h4>
          <p className="text-xs text-slate-600">
            Every task in TaskFlow is rendered with semantic HTML (<code className="text-xs bg-slate-200 px-1 rounded">&lt;li&gt;</code>, <code className="text-xs bg-slate-200 px-1 rounded">&lt;button&gt;</code>, <code className="text-xs bg-slate-200 px-1 rounded">&lt;input&gt;</code>) and mapped with HTML5 data attributes like <code className="text-xs bg-slate-200 px-1 rounded">data-action</code> and <code className="text-xs bg-slate-200 px-1 rounded">data-task-id</code>.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'event-delegation',
    title: '2. Delegated Event Handling',
    icon: Zap,
    badge: 'Performance & Architecture',
    summary: 'Binding one parent listener to intercept events bubbling up from hundreds of tasks.',
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          Attaching separate <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded text-xs">addEventListener</code> callbacks to every checkbox, edit icon, and delete button creates thousands of closures and degrades memory.
        </p>
        <p>
          <strong>Event Delegation</strong> leverages DOM Event Bubbling: events trigger on the target child and bubble up the hierarchy to the parent <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded text-xs">&lt;ul&gt;</code>.
        </p>

        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
          <div className="text-slate-400">// Single Delegated Listener Pattern:</div>
          <div>taskList.addEventListener(&apos;click&apos;, (e) =&gt; &#123;</div>
          <div>&nbsp;&nbsp;const btn = (e.target as HTMLElement).closest(&apos;[data-action]&apos;);</div>
          <div>&nbsp;&nbsp;if (!btn) return;</div>
          <div>&nbsp;&nbsp;const action = btn.getAttribute(&apos;data-action&apos;);</div>
          <div>&nbsp;&nbsp;const taskId = btn.getAttribute(&apos;data-task-id&apos;);</div>
          <div>&nbsp;&nbsp;handleAction(action, taskId);</div>
          <div>&#125;);</div>
        </div>

        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
          <h4 className="font-semibold text-slate-900 text-xs mb-1">Delegation Hierarchy</h4>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span>&lt;button&gt; Click</span>
            <span>&rarr;</span>
            <span>Bubbles to &lt;li&gt;</span>
            <span>&rarr;</span>
            <span>Intercepted by &lt;ul&gt; Container</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'state-management',
    title: '3. State-Driven CRUD Cycles',
    icon: Database,
    badge: 'Data Flow',
    summary: 'Unidirectional data cycle: Action &rarr; State Transformation &rarr; Reactive Re-render.',
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          Instead of manually tweaking styles on each DOM element, our state is the single source of truth. The application follows predictable CRUD cycles:
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="font-semibold text-slate-900">Create:</span>
            <p className="text-slate-600 mt-0.5">Prepend new immutable task record with UUID and timestamp.</p>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="font-semibold text-slate-900">Read & Filter:</span>
            <p className="text-slate-600 mt-0.5">Filter pipeline (Status, Search query, Priority, Due date).</p>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="font-semibold text-slate-900">Update:</span>
            <p className="text-slate-600 mt-0.5">Toggle completion, edit title inline, update subtasks.</p>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="font-semibold text-slate-900">Delete:</span>
            <p className="text-slate-600 mt-0.5">Remove item by ID with instant undo toast fallback.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
          <div className="text-slate-400">// Immutable State Update Example:</div>
          <div>setTasks(prevTasks =&gt; prevTasks.map(t =&gt;</div>
          <div>&nbsp;&nbsp;t.id === targetId ? &#123; ...t, completed: !t.completed &#125; : t</div>
          <div>));</div>
        </div>
      </div>
    ),
  },
  {
    id: 'local-storage',
    title: '4. window.localStorage Persistence',
    icon: BookOpen,
    badge: 'Data Persistence',
    summary: 'Auto-syncing client storage, quota governance, and cross-tab synchronization.',
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          Browser <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded text-xs">window.localStorage</code> provides synchronous string-key persistence surviving refreshes and reboots.
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
          <li><strong>JSON Serialization:</strong> Converting task objects to JSON strings via <code className="bg-slate-100 px-1 py-0.5 rounded">JSON.stringify()</code> on state updates.</li>
          <li><strong>Storage Events:</strong> Listening to <code className="bg-slate-100 px-1 py-0.5 rounded">window.addEventListener(&apos;storage&apos;, ...)</code> updates open tabs instantaneously.</li>
          <li><strong>Resilient Quota Recovery:</strong> Try/catch guards prevent crashes when storage quotas are exceeded.</li>
          <li><strong>Backup & Portability:</strong> Export to JSON file and import restoration.</li>
        </ul>

        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
          <div className="text-slate-400">// Cross-tab synchronization:</div>
          <div>window.addEventListener(&apos;storage&apos;, (e) =&gt; &#123;</div>
          <div>&nbsp;&nbsp;if (e.key === &apos;taskflow_todos_v1&apos; &amp;&amp; e.newValue) &#123;</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;setTasks(JSON.parse(e.newValue));</div>
          <div>&nbsp;&nbsp;&#125;</div>
          <div>&#125;);</div>
        </div>
      </div>
    ),
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const currentChapter = CHAPTERS[activeTab];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Task Tutorial: DOM & State Mastery</h3>
              <p className="text-xs text-slate-500">Interactive architectural guide to client-side logic & persistence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 gap-2 overflow-x-auto py-2">
          {CHAPTERS.map((chapter, idx) => {
            const Icon = chapter.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={chapter.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{chapter.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {currentChapter.badge}
            </span>
            <span className="text-xs text-slate-400">Chapter {activeTab + 1} of {CHAPTERS.length}</span>
          </div>

          <h4 className="text-lg font-semibold text-slate-900">{currentChapter.title}</h4>
          <p className="text-xs text-slate-500">{currentChapter.summary}</p>

          <div className="pt-2">{currentChapter.content}</div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
            disabled={activeTab === 0}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {CHAPTERS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  activeTab === i ? 'w-5 bg-indigo-600' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          {activeTab < CHAPTERS.length - 1 ? (
            <button
              onClick={() => setActiveTab((prev) => Math.min(CHAPTERS.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <span>Next Chapter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Got it, Let&apos;s Build!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
