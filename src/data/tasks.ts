import { createContext, useContext } from 'react';

export interface Task {
  id: number;
  title: string;
  notes: string;
  done: boolean;
}

export interface TasksContextValue {
  tasks: Task[];
  addTask: (title: string, notes: string) => void;
  updateTask: (id: number, changes: Partial<Omit<Task, 'id'>>) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used inside <TasksProvider>');
  return context;
};
