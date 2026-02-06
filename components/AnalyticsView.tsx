'use client';

import { useMemo } from 'react';
import { useHabitStore } from '@/lib/store';
import { isToday, format, startOfYear, eachDayOfInterval, isSameDay } from 'date-fns';
import { calculateStreak } from '@/lib/utils';

export default function AnalyticsView() {
  const { habits, logs } = useHabitStore();

  const completionRates = useMemo(() => {
    const rates: Record<string, { completed: number; total: number; rate: number }> = {};

    habits.forEach((habit) => {
      const habitLogs = logs.filter((log) => log.habit_id === habit.id);
      const completed = habitLogs.filter((log) => log.status === 'completed').length;
      const total = habitLogs.length;
      rates[habit.id] = {
        completed,
        total,
        rate: total > 0 ? (completed / total) * 100 : 0,
      };
    });

    return rates;
  }, [habits, logs]);

  const heatmapData = useMemo(() => {
    const yearStart = startOfYear(new Date());
    const today = new Date();
    const days = eachDayOfInterval({ start: yearStart, end: today });

    return days.map((day) => {
      const dayLogs = logs.filter((log) => isSameDay(new Date(log.completed_at), day));
      const completedCount = dayLogs.filter((log) => log.status === 'completed').length;
      const totalHabits = habits.filter((habit) => {
        const dayName = format(day, 'EEE');
        return habit.frequency.includes(dayName) && !habit.archived;
      }).length;

      return {
        date: day,
        count: completedCount,
        total: totalHabits,
        intensity: totalHabits > 0 ? completedCount / totalHabits : 0,
      };
    });
  }, [logs, habits]);

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (intensity < 0.25) return 'bg-green-200 dark:bg-green-900';
    if (intensity < 0.5) return 'bg-green-400 dark:bg-green-700';
    if (intensity < 0.75) return 'bg-green-600 dark:bg-green-600';
    return 'bg-green-800 dark:bg-green-500';
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">The Truth</h1>

      {/* Heatmap */}
      <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Consistency Heatmap
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {heatmapData.map((day, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)}`}
                title={`${format(day.date, 'MMM d')}: ${day.count}/${day.total} habits`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </section>

      {/* Completion Rates */}
      <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Completion Rates
        </h2>
        <div className="space-y-4">
          {habits
            .filter((h) => !h.archived)
            .map((habit) => {
              const rate = completionRates[habit.id];
              const streak = calculateStreak(logs, habit.id);
              return (
                <div key={habit.id} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{habit.title}</h3>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {rate ? Math.round(rate.rate) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        rate && rate.rate >= 80
                          ? 'bg-green-600'
                          : rate && rate.rate >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${rate ? rate.rate : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {rate?.completed || 0} / {rate?.total || 0} completed
                    </span>
                    <span>🔥 {streak} day streak</span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Journal Prompts */}
      <section className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Reflection Prompts
        </h2>
        <div className="space-y-3">
          {habits
            .filter((h) => {
              const todayLogs = logs.filter(
                (log) => log.habit_id === h.id && isToday(new Date(log.completed_at))
              );
              return todayLogs.some((log) => log.status !== 'completed');
            })
            .map((habit) => {
              const todayLog = logs.find(
                (log) => log.habit_id === habit.id && isToday(new Date(log.completed_at))
              );
              return (
                <div
                  key={habit.id}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                >
                  <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                    {habit.title}
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    What caused the friction today? {todayLog?.notes && `→ ${todayLog.notes}`}
                  </p>
                </div>
              );
            })}
          {habits.filter((h) => {
            const todayLogs = logs.filter(
              (log) => log.habit_id === h.id && isToday(new Date(log.completed_at))
            );
            return todayLogs.some((log) => log.status !== 'completed');
          }).length === 0 && (
            <p className="text-slate-600 dark:text-slate-400 text-center py-4">
              All habits completed today! 🎉
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
