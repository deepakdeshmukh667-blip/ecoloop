import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Badges & Achievements',
  description: 'Earned community trophies, streak milestones, and verified segregation badges in Tower B.',
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
