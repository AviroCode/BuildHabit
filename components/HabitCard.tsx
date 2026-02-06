'use client';

import { useState } from 'react';
import { Habit } from '@/lib/supabase';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  emergencyMode?: boolean;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export default function HabitCard({
  habit,
  completed,
  emergencyMode = false,
  onSwipeRight,
  onSwipeLeft,
}: HabitCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const deltaX = e.touches[0].clientX - e.touches[0].clientX;
    setSwipeOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 100) {
      setFlashColor('green');
      setTimeout(() => {
        onSwipeRight();
        setFlashColor(null);
      }, 200);
    } else if (swipeOffset < -100) {
      setFlashColor('red');
      setTimeout(() => {
        onSwipeLeft();
        setFlashColor(null);
      }, 200);
    }
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const handleClick = (direction: 'right' | 'left') => {
    if (direction === 'right') {
      setFlashColor('green');
      setTimeout(() => {
        onSwipeRight();
        setFlashColor(null);
      }, 200);
    } else {
      setFlashColor('red');
      setTimeout(() => {
        onSwipeLeft();
        setFlashColor(null);
      }, 200);
    }
  };

  return (
    <div
      className={`relative rounded-lg p-5 transition-all duration-200 ${
        completed
          ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600'
          : emergencyMode
          ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600'
          : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
      } ${flashColor === 'green' ? 'bg-green-300 dark:bg-green-700' : ''} ${
        flashColor === 'red' ? 'bg-red-300 dark:bg-red-700' : ''
      }`}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        touchAction: 'pan-y',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {emergencyMode && !completed && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          EMERGENCY MODE
        </div>
      )}
      {completed && (
        <div className="absolute top-2 right-2 text-green-600 dark:text-green-400 text-2xl">
          ✓
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{habit.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{habit.trigger_cue}</p>
      {!completed && (
        <div className="flex gap-3">
          <button
            onClick={() => handleClick('left')}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold active:bg-red-600"
          >
            Skip
          </button>
          <button
            onClick={() => handleClick('right')}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold active:bg-green-600"
          >
            Complete
          </button>
        </div>
      )}
    </div>
  );
}
