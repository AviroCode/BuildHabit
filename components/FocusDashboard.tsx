'use client';

import { useState, useEffect } from 'react';
import { useHabitStore } from '@/lib/store';
import { supabase, HabitLog } from '@/lib/supabase';
import {
  getGreeting,
  getTimeOfDay,
  getCurrentStreak,
  getDayProgress,
  getHabitsForTimeBlock,
  didMissYesterday,
  isCompletedToday,
  groupHabitsByTrigger,
} from '@/lib/utils';
import HabitCard from './HabitCard';
import ProgressCircle from './ProgressCircle';
import { isToday, format } from 'date-fns';

export default function FocusDashboard() {
  const { habits, logs, addLog, updateLog } = useHabitStore();
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [showFrictionModal, setShowFrictionModal] = useState<{
    show: boolean;
    habitId: string;
  }>({ show: false, habitId: '' });

  const currentTime = getTimeOfDay();
  const nowHabits = getHabitsForTimeBlock(habits, currentTime);
  const laterHabits = habits.filter(
    (h) =>
      h.time_of_day !== currentTime &&
      !h.archived &&
      h.frequency.includes(format(new Date(), 'EEE'))
  );

  const streak = getCurrentStreak(logs);
  const progress = getDayProgress(logs, habits);
  const remainingCount = nowHabits.filter((h) => !isCompletedToday(logs, h.id)).length;

  const handleComplete = async (habitId: string, status: 'completed' | 'skipped' | 'failed') => {
    if (status === 'skipped') {
      setShowFrictionModal({ show: true, habitId });
      return;
    }

    // Optimistic update
    const tempLog: HabitLog = {
      id: `temp-${Date.now()}`,
      habit_id: habitId,
      completed_at: new Date().toISOString(),
      status,
    };
    addLog(tempLog);

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          completed_at: new Date().toISOString(),
          status,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp log with real one
      updateLog(tempLog.id, { id: data.id });
    } catch (error) {
      console.error('Error logging habit:', error);
      // Revert optimistic update
      // In a real app, you'd remove the temp log
    }
  };

  const handleFrictionSubmit = async (reason: string) => {
    await handleComplete(showFrictionModal.habitId, 'skipped');
    // Save friction reason
    try {
      const latestLog = logs.find(
        (l) => l.habit_id === showFrictionModal.habitId && isToday(new Date(l.completed_at))
      );
      if (latestLog) {
        await supabase
          .from('habit_logs')
          .update({ notes: reason })
          .eq('id', latestLog.id);
      }
    } catch (error) {
      console.error('Error saving friction reason:', error);
    }
    setShowFrictionModal({ show: false, habitId: '' });
  };

  const groupedNowHabits = groupHabitsByTrigger(nowHabits);
  const allNowCompleted = nowHabits.every((h) => isCompletedToday(logs, h.id));

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {getGreeting()}. {remainingCount} {remainingCount === 1 ? 'Habit' : 'Habits'} Remaining.
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <ProgressCircle progress={progress} size={60} />
        </div>
      </header>

      {/* Now Stack */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
          The &quot;Now&quot; Stack
        </h2>
        {allNowCompleted ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
              {currentTime.charAt(0).toUpperCase() + currentTime.slice(1)} Won! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedNowHabits).map(([trigger, triggerHabits]) => (
              <div key={trigger} className="space-y-2">
                {triggerHabits.map((habit) => {
                  const missedYesterday = didMissYesterday(logs, habit.id);
                  const completed = isCompletedToday(logs, habit.id);
                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completed={completed}
                      emergencyMode={missedYesterday && !completed}
                      onSwipeRight={() => handleComplete(habit.id, 'completed')}
                      onSwipeLeft={() => handleComplete(habit.id, 'skipped')}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Later Queue */}
      {laterHabits.length > 0 && (
        <section className="px-4 py-6 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4">
            The &quot;Later&quot; Queue
          </h2>
          <div className="space-y-2">
            {laterHabits.map((habit) => (
              <div
                key={habit.id}
                className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 text-slate-600 dark:text-slate-400"
              >
                <p className="font-medium">{habit.title}</p>
                <p className="text-sm mt-1">{habit.trigger_cue}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Friction Modal */}
      {showFrictionModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
              What caused the friction today?
            </h3>
            <textarea
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg mb-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              rows={4}
              placeholder="e.g., Too tired, forgot, no time..."
              id="friction-reason"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowFrictionModal({ show: false, habitId: '' })}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason = (document.getElementById('friction-reason') as HTMLTextAreaElement)
                    .value;
                  handleFrictionSubmit(reason || 'No reason provided');
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
