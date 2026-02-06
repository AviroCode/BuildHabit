'use client';

import { useEffect, useState } from 'react';
import { useHabitStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import FocusDashboard from '@/components/FocusDashboard';
import HabitArchitect from '@/components/HabitArchitect';
import AnalyticsView from '@/components/AnalyticsView';
import { getTimeOfDay } from '@/lib/utils';

type View = 'focus' | 'architect' | 'analytics';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('focus');
  const { habits, logs, setHabits, setLogs, loading, setLoading } = useHabitStore();

  async function loadData() {
    setLoading(true);
    try {
      // In a real app, you'd filter by user_id from auth
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(1000);

      if (logsError) throw logsError;

      setHabits(habitsData || []);
      setLogs(logsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // We intentionally don't include loadData in deps to avoid ref churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView('focus')}
            className={`flex-1 flex flex-col items-center justify-center h-full ${
              currentView === 'focus'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Focus</span>
          </button>
          <button
            onClick={() => setCurrentView('architect')}
            className={`flex-1 flex flex-col items-center justify-center h-full ${
              currentView === 'architect'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">Build</span>
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`flex-1 flex flex-col items-center justify-center h-full ${
              currentView === 'analytics'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Truth</span>
          </button>
        </div>
      </nav>

      <div className="pb-16">
        {currentView === 'focus' && <FocusDashboard />}
        {currentView === 'architect' && <HabitArchitect onComplete={loadData} />}
        {currentView === 'analytics' && <AnalyticsView />}
      </div>
    </main>
  );
}
