# EcoLoop — Gamified Waste Segregation & Society Habit Platform

EcoLoop is a full-stack Next.js application that turns daily waste segregation into a community habit game. Residents verify waste via AI-powered camera analysis, earn eco-points, compete on leaderboards, and unlock rewards. Society admins get a live compliance dashboard and spot-check audit tools.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Google Gemini Vision (or demo mode)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ecoloop.git
cd ecoloop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your real Supabase project credentials.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase anon/public key |
| `AI_PROVIDER` | ✅ | `demo` (mock) or `gemini` (live AI) |
| `GEMINI_API_KEY` | Optional | Required only if `AI_PROVIDER=gemini` |

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Add all environment variables in the Vercel dashboard
4. Click **Deploy**

## Project Structure

```
app/               # Next.js App Router pages
  resident/        # Resident-facing screens
  admin/           # Admin portal screens
components/        # Shared UI components
lib/
  ai/              # AI waste verification engine
  data/            # Seed data & demo state
  state/           # Global app state (Context API)
  supabase/        # Supabase client factories
public/            # Static assets
supabase/          # Database migrations
types/             # TypeScript interfaces
```

## License

Private — Green Valley Residency EcoLoop Project
