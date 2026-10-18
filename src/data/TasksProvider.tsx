import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Task, TasksContext } from './tasks';

const STORAGE_KEY = 'tasks';

const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Install the Ionic CLI', notes: '', done: true },
    { id: 2, title: 'Create my first Ionic app', notes: 'Use the tabs starter', done: false }
  ]);
  const [loaded, setLoaded] = useState(false);

  // Read the saved tasks once when the app starts
  useEffect(() => {
    Preferences.get({ key: STORAGE_KEY }).then(({ value }) => {
      if (value) setTasks(JSON.parse(value));
      setLoaded(true);
    });
  }, []);

  // Save after every change, but only once loading is done so the defaults never win
  useEffect(() => {
    if (!loaded) return;
    Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(tasks) });
  }, [tasks, loaded]);

  const addTask = (title: string, notes: string) =>
    setTasks((prev) => [...prev, { id: Date.now(), title, notes, done: false }]);

  const updateTask = (id: number, changes: Partial<Omit<Task, 'id'>>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  const toggleTask = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
