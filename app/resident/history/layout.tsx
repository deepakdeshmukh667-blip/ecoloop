import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Verification History',
  description: 'Chronological timeline of daily kitchen waste classifications, confidence scores, and points earned.',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
