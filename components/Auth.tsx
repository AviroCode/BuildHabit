'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: 'Account created. Check your email to confirm, or sign in below.',
        });
        setPassword('');
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      }
      // On success, onAuthStateChange in page.tsx will set session and show the app
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Habit OS</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {isSignUp ? 'Create an account' : 'Sign in with your email and password.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSignUp && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">At least 6 characters</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage(null);
            setPassword('');
          }}
          className="mt-4 w-full text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
        </button>
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </main>
  );
}
