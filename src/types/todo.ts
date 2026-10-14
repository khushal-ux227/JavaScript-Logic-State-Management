export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  priority: Priority;
  category: string;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  subtasks: Subtask[];
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type TimeframeFilter = 'all' | 'today' | 'upcoming' | 'overdue';
export type SortOption = 'created-desc' | 'created-asc' | 'due-asc' | 'priority-desc' | 'title-asc';

export interface FilterCriteria {
  status: FilterStatus;
  category: string;
  priority: 'all' | Priority;
  timeframe: TimeframeFilter;
  searchQuery: string;
  sortBy: SortOption;
}

export interface DomEventLog {
  id: string;
  timestamp: string;
  type: string;
  targetTag: string;
  action: string;
  taskId?: string;
  detail: string;
}

export interface StorageMetrics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  highPriorityTasks: number;
  dueTodayCount: number;
  overdueCount: number;
  bytesUsed: number;
  lastUpdated: string;
}
