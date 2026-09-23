import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Resident Dashboard',
  description: 'Track daily waste segregation streams, streak bonus multiplier, and resident habit index.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
