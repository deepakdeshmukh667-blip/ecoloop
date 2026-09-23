import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Sorting Guide & Learn',
  description: 'Municipal waste segregation rules, bin color codes, and kitchen sorting best practices.',
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
