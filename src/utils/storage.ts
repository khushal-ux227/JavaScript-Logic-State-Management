import { Task } from '../types/todo';

export const STORAGE_KEY = 'taskflow_todos_v1';
export const PREFERENCES_KEY = 'taskflow_preferences_v1';

export const DEFAULT_CATEGORIES = [
  'General',
  'Frontend Engineering',
  'DOM & State',
  'UI/UX Design',
  'Personal',
];

const getTodayString = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement DOM Event Delegation for task list container',
    description: 'Use a single delegated listener on the parent ul element and inspect e.target.closest("[data-action]") to avoid memory leaks.',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    priority: 'high',
    category: 'DOM & State',
    dueDate: getTodayString(-1),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    subtasks: [
      { id: 'sub-1-1', title: 'Bind single click handler on parent container', completed: true },
      { id: 'sub-1-2', title: 'Extract action identifier via data-action attribute', completed: true },
      { id: 'sub-1-3', title: 'Verify performance improvement over per-element listeners', completed: true },
    ],
  },
  {
    id: 'task-2',
    title: 'Wire reactive window.localStorage synchronization',
    description: 'Serialize state automatically on each mutation and listen to "storage" window events for multi-tab synchronization.',
    completed: false,
    priority: 'high',
    category: 'Frontend Engineering',
    dueDate: getTodayString(0),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    subtasks: [
      { id: 'sub-2-1', title: 'Create safe JSON serialize/deserialize wrapper with try/catch', completed: true },
      { id: 'sub-2-2', title: 'Display live localStorage byte calculation in inspector', completed: false },
      { id: 'sub-2-3', title: 'Add JSON backup export and import parser', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Test multi-criteria filtering and sorting pipeline',
    description: 'Validate filtering across status (All, Active, Completed), text search query, priorities, and category tabs.',
    completed: false,
    priority: 'medium',
    category: 'Frontend Engineering',
    dueDate: getTodayString(1),
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    subtasks: [
      { id: 'sub-3-1', title: 'Active vs Completed predicates', completed: true },
      { id: 'sub-3-2', title: 'Case-insensitive search query matching title and notes', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Review keyboard accessibility and shortcuts',
    description: 'Enable keyboard traversal, quick-add submission on Enter, inline edit cancellation on Escape, and "/" shortcut to focus search.',
    completed: false,
    priority: 'low',
    category: 'UI/UX Design',
    dueDate: getTodayString(3),
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    subtasks: [
      { id: 'sub-4-1', title: 'Add visible focus-visible outlines', completed: true },
      { id: 'sub-4-2', title: 'Register global keyboard listeners with cleanup', completed: false },
    ],
  },
];

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (error) {
    console.warn('Failed to parse tasks from localStorage, resetting to initial tasks:', error);
    return INITIAL_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(tasks);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save tasks to localStorage (quota exceeded or restricted):', error);
    return false;
  }
}

export function calculateStorageBytes(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) || '';
    return new Blob([raw]).size;
  } catch {
    return 0;
  }
}

export function exportTasksToJsonFile(tasks: Task[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `taskflow-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function parseTasksFromJsonFile(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('Imported JSON is not an array of tasks');
        }
        // Basic normalization and validation
        const validated: Task[] = parsed.map((item, idx) => ({
          id: String(item.id || `imported-${Date.now()}-${idx}`),
          title: String(item.title || 'Untitled Task'),
          description: item.description ? String(item.description) : undefined,
          completed: Boolean(item.completed),
          completedAt: item.completedAt ? String(item.completedAt) : undefined,
          priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
          category: String(item.category || 'General'),
          dueDate: item.dueDate ? String(item.dueDate) : undefined,
          createdAt: String(item.createdAt || new Date().toISOString()),
          updatedAt: String(item.updatedAt || new Date().toISOString()),
          subtasks: Array.isArray(item.subtasks)
            ? item.subtasks.map((s: { id?: string; title?: string; completed?: boolean }, sIdx: number) => ({
                id: String(s.id || `sub-${Date.now()}-${sIdx}`),
                title: String(s.title || 'Subtask'),
                completed: Boolean(s.completed),
              }))
            : [],
        }));
        resolve(validated);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read backup file'));
    reader.readAsText(file);
  });
}
