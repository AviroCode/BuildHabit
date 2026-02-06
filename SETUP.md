# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to SQL Editor → New Query
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the query
   - Go to Settings → API
   - Copy your Project URL and anon key

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Supabase credentials.

4. **Run the app:**
   ```bash
   npm run dev
   ```

## Authentication Setup (Optional)

Currently, the app uses a hardcoded `user_id` ('demo-user') for demonstration. To enable real authentication:

1. **Enable Supabase Auth:**
   - In Supabase dashboard, go to Authentication → Providers
   - Enable Email provider (or your preferred method)

2. **Update the code:**
   - Install `@supabase/auth-helpers-nextjs` or use Supabase client auth
   - Replace `'demo-user'` in `components/HabitArchitect.tsx` with actual user ID from auth
   - Update `app/page.tsx` to filter habits/logs by authenticated user

3. **Example auth integration:**
   ```typescript
   // In HabitArchitect.tsx
   const { data: { user } } = await supabase.auth.getUser();
   const userId = user?.id || 'demo-user';
   
   // In page.tsx
   const { data: { user } } = await supabase.auth.getUser();
   const userId = user?.id;
   
   const { data: habitsData } = await supabase
     .from('habits')
     .select('*')
     .eq('user_id', userId)
     .eq('archived', false);
   ```

## PWA Icons

Create two icon files for PWA functionality:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

See `scripts/create-icons.md` for details.

## Testing Without Supabase

For local development without Supabase, you can:
1. Use mock data in the Zustand store
2. Comment out Supabase calls temporarily
3. Use localStorage as a fallback (not recommended for production)

## Troubleshooting

**"Supabase credentials not found" warning:**
- Make sure `.env.local` exists and has correct values
- Restart the dev server after adding env variables

**Database errors:**
- Verify schema.sql was run successfully
- Check Row Level Security (RLS) policies if using auth
- Ensure tables exist in Supabase dashboard

**Build errors:**
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Check Node.js version (18+ required)
