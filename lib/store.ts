import { create } from 'zustand';
import { Habit, HabitLog } from './supabase';

interface HabitStore {
  habits: Habit[];
  logs: HabitLog[];
  loading: boolean;
  setHabits: (habits: Habit[]) => void;
  setLogs: (logs: HabitLog[]) => void;
  addHabit: (habit: Habit) => void;
  addLog: (log: HabitLog) => void;
  updateLog: (logId: string, updates: Partial<HabitLog>) => void;
  setLoading: (loading: boolean) => void;
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  logs: [],
  loading: false,
  setHabits: (habits) => set({ habits }),
  setLogs: (logs) => set({ logs }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  updateLog: (logId, updates) =>
    set((state) => ({
      logs: state.logs.map((log) =>
        log.id === logId ? { ...log, ...updates } : log
      ),
    })),
  setLoading: (loading) => set({ loading }),
}));
