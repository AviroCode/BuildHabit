import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
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
