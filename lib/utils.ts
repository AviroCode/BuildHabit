import { format, isToday, isYesterday, startOfDay, differenceInDays } from 'date-fns';
import { Habit, HabitLog } from './supabase';

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function calculateStreak(logs: HabitLog[], habitId: string): number {
  const habitLogs = logs
    .filter((log) => log.habit_id === habitId && log.status === 'completed')
    .map((log) => startOfDay(new Date(log.completed_at)))
    .filter((date, index, self) => 
      // Remove duplicates
      index === self.findIndex((d) => d.getTime() === date.getTime())
    )
    .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

  if (habitLogs.length === 0) return 0;

  let streak = 0;
  let expectedDate = startOfDay(new Date());

  // Check if today is completed, if not start from yesterday
  const todayCompleted = habitLogs.some(
    (date) => date.getTime() === expectedDate.getTime()
  );
  
  if (!todayCompleted) {
    expectedDate = startOfDay(new Date());
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  for (const logDate of habitLogs) {
    const daysDiff = differenceInDays(expectedDate, logDate);
    
    if (daysDiff === 0) {
      // This day matches what we're looking for
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (daysDiff > 0) {
      // Gap found, streak broken
      break;
    }
    // If daysDiff < 0, we've gone past the expected date, skip
  }

  return streak;
}

export function getCurrentStreak(logs: HabitLog[]): number {
  const allHabits = new Set(logs.map((log) => log.habit_id));
  let minStreak = Infinity;

  for (const habitId of allHabits) {
    const streak = calculateStreak(logs, habitId);
    if (streak < minStreak) minStreak = streak;
  }

  return minStreak === Infinity ? 0 : minStreak;
}

export function getDayProgress(logs: HabitLog[], habits: Habit[]): number {
  const today = new Date();
  const todayLogs = logs.filter((log) => isToday(new Date(log.completed_at)));
  const todayHabits = habits.filter((habit) => {
    const dayName = format(today, 'EEE');
    return habit.frequency.includes(dayName) && !habit.archived;
  });

  if (todayHabits.length === 0) return 0;
  return (todayLogs.filter((log) => log.status === 'completed').length / todayHabits.length) * 100;
}

export function getHabitsForTimeBlock(
  habits: Habit[],
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): Habit[] {
  const today = new Date();
  const dayName = format(today, 'EEE');

  return habits.filter(
    (habit) =>
      habit.time_of_day === timeOfDay &&
      habit.frequency.includes(dayName) &&
      !habit.archived
  );
}

export function didMissYesterday(logs: HabitLog[], habitId: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayLogs = logs.filter(
    (log) =>
      log.habit_id === habitId &&
      isYesterday(new Date(log.completed_at)) &&
      log.status !== 'completed'
  );

  return yesterdayLogs.length > 0;
}

export function isCompletedToday(logs: HabitLog[], habitId: string): boolean {
  return logs.some(
    (log) =>
      log.habit_id === habitId &&
      isToday(new Date(log.completed_at)) &&
      log.status === 'completed'
  );
}

export function groupHabitsByTrigger(habits: Habit[]): Record<string, Habit[]> {
  return habits.reduce((acc, habit) => {
    const trigger = habit.trigger_cue;
    if (!acc[trigger]) {
      acc[trigger] = [];
    }
    acc[trigger].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);
}
