import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Community Challenges',
  description: 'Inter-tower segregation derbies, community zero-landfill drives, and society rewards.',
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
