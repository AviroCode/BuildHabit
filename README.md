# Habit OS - Your Personal Habit Tracker

A behavioral psychology-based habit tracker built on Atomic Habits principles. This Progressive Web App (PWA) helps you build and maintain habits with reduced friction and immediate feedback.

## Features

### 🎯 Focus Dashboard (Home Screen)
- **Clutter-free interface** - See only what matters now
- **Time-based organization** - Habits grouped by morning/afternoon/evening
- **Visual progress tracking** - Circular progress bar and streak counter
- **Swipe interactions** - Swipe right to complete, left to skip
- **Emergency Mode** - Highlights habits you missed yesterday (Never Miss Twice rule)

### 🏗️ Habit Architect (Builder Wizard)
- **Implementation Intention** - Define triggers using "I will [X] at [Y] in [Z]"
- **2-Minute Rule** - Forces optimization by checking if first step takes <2 minutes
- **Flexible scheduling** - Daily, weekdays, or custom frequency
- **Category tagging** - Organize by Health, Wealth, or Wisdom

### 📊 The Truth (Analytics & Reflection)
- **Consistency Heatmap** - GitHub-style contribution graph
- **Completion Rates** - See which habits you're consistent with
- **Friction Logging** - When you skip, capture why (turns failure into data)
- **Journal Prompts** - Reflection questions for missed habits

## Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account (free tier works)

### Installation

1. **Clone and install dependencies:**

```bash
cd HabitBuilder
npm install
```

2. **Set up Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `supabase/schema.sql`
   - Go to Settings > API and copy your project URL and anon key

3. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
HabitBuilder/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page with navigation
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── FocusDashboard.tsx # Main dashboard view
│   ├── HabitArchitect.tsx # Habit creation wizard
│   ├── AnalyticsView.tsx  # Analytics and reflection
│   ├── HabitCard.tsx      # Individual habit card
│   └── ProgressCircle.tsx # Circular progress indicator
├── lib/                   # Utilities and configuration
│   ├── supabase.ts       # Supabase client and types
│   ├── store.ts          # Zustand state management
│   └── utils.ts          # Helper functions
├── supabase/
│   └── schema.sql        # Database schema
└── public/               # Static assets
    └── manifest.json     # PWA manifest
```

## Key Features Explained

### Never Miss Twice Rule
If you miss a habit yesterday, it's highlighted in red with "EMERGENCY MODE" today. This prevents the habit from slipping away.

### Habit Stacking
Habits are grouped by their trigger cue, so you see related habits together (e.g., "Morning Routine" with 3 habits).

### Friction Logging
When you skip a habit, you're required to explain why. This data helps identify patterns and reduce friction over time.

### Optimistic UI
Actions feel instant - the UI updates immediately, then syncs with the database in the background.

## Database Schema

### Habits Table
- `id`: UUID primary key
- `user_id`: Links to authenticated user
- `title`: Habit name
- `trigger_cue`: Implementation intention
- `time_of_day`: morning/afternoon/evening
- `frequency`: Array of days (Mon, Tue, etc.)
- `category`: health/wealth/wisdom
- `two_minute_rule`: Boolean flag
- `archived`: Soft delete flag

### Habit Logs Table
- `id`: UUID primary key
- `habit_id`: Foreign key to habits
- `completed_at`: Timestamp
- `status`: completed/skipped/failed
- `notes`: Optional reflection text

## Roadmap

- [ ] User authentication (Supabase Auth)
- [ ] Push notifications for reminders
- [ ] Habit templates library
- [ ] Social sharing of streaks
- [ ] Export data functionality
- [ ] Dark mode improvements
- [ ] Offline support with service workers

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT

## Acknowledgments

Inspired by James Clear's "Atomic Habits" and behavioral psychology principles.
