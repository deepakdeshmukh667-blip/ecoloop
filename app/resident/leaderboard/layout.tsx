import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Leaderboard & Standings',
  description: 'Live community leaderboard rankings, weekly podium, and points gap tracking for Tower B.',
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
