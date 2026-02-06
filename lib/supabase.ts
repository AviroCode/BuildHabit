import { createClient } from '@supabase/supabase-js';

// Get environment variables and trim whitespace
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  console.error('Current values:', {
    url: supabaseUrl || '(empty)',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : '(empty)',
  });
}

if (supabaseUrl && !isValidUrl(supabaseUrl)) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  console.error('URL must start with http:// or https://');
}

// Create client - throw error if invalid to catch issues early
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

if (!isValidUrl(supabaseUrl)) {
  throw new Error(`Invalid Supabase URL: "${supabaseUrl}". Must be a valid HTTP or HTTPS URL.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Habit {
  id: string;
  user_id: string;
  title: string;
  trigger_cue: string;
  time_of_day: 'morning' | 'afternoon' | 'evening';
  frequency: string[]; // ['Mon', 'Tue', 'Wed', ...]
  category: 'health' | 'wealth' | 'wisdom';
  two_minute_rule: boolean;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  status: 'completed' | 'skipped' | 'failed';
  notes?: string;
}
