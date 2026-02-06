'use client';

import { useState } from 'react';
import { supabase, Habit } from '@/lib/supabase';
import { useHabitStore } from '@/lib/store';

interface HabitArchitectProps {
  onComplete: () => void;
}

export default function HabitArchitect({ onComplete }: HabitArchitectProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    trigger_cue: '',
    time_of_day: 'morning' as 'morning' | 'afternoon' | 'evening',
    frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    category: 'health' as 'health' | 'wealth' | 'wisdom',
    two_minute_rule: false,
  });
  const [loading, setLoading] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSubmit = async () => {
    if (!formData.title || !formData.trigger_cue) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Get the currently authenticated user from Supabase Auth
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        throw new Error('Unable to fetch authenticated user');
      }

      if (!user) {
        alert('You must be signed in to create habits.');
        return;
      }

      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...formData,
          user_id: user.id, // real Supabase auth user id (UUID)
        })
        .select()
        .single();

      if (error) throw error;

      onComplete();
      // Reset form
      setFormData({
        title: '',
        trigger_cue: '',
        time_of_day: 'morning',
        frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        category: 'health',
        two_minute_rule: false,
      });
      setStep(1);
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Habit Architect
      </h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Step 1: Name Your Habit
            </h2>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Read Books"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <button
              onClick={() => setStep(2)}
              disabled={!formData.title}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-slate-400"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Trigger */}
        {step === 2 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Step 2: Define Your Trigger (Implementation Intention)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              I will <strong>[{formData.title || 'Habit'}]</strong> at{' '}
              <strong>[Time/Context]</strong> in <strong>[Location]</strong>
            </p>
            <input
              type="text"
              value={formData.trigger_cue}
              onChange={(e) => setFormData({ ...formData, trigger_cue: e.target.value })}
              placeholder="e.g., After I brush my teeth, at 7:00 PM, in the living room"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Time of Day:
              </label>
              <select
                value={formData.time_of_day}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    time_of_day: e.target.value as 'morning' | 'afternoon' | 'evening',
                  })
                }
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.trigger_cue}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-slate-400"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 2-Minute Rule & Frequency */}
        {step === 3 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Step 3: Optimize & Schedule
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="two-minute"
                  checked={formData.two_minute_rule}
                  onChange={(e) =>
                    setFormData({ ...formData, two_minute_rule: e.target.checked })
                  }
                  className="mt-1 w-5 h-5"
                />
                <label
                  htmlFor="two-minute"
                  className="text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <strong>The 2-Minute Rule:</strong> Can the first step of this habit be done in 2
                  minutes? (Forces optimization)
                </label>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Frequency:
                </label>
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        const newFreq = formData.frequency.includes(day)
                          ? formData.frequency.filter((d) => d !== day)
                          : [...formData.frequency, day];
                        setFormData({ ...formData, frequency: newFreq });
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.frequency.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Category:
                </label>
                <div className="flex gap-2">
                  {(['health', 'wealth', 'wisdom'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium capitalize ${
                        formData.category === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || formData.frequency.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold disabled:bg-slate-400"
              >
                {loading ? 'Creating...' : 'Create Habit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
