import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Society Admin Portal',
  description: 'Society municipal compliance portal, resident directory, spot check scheduling, and diversion telemetry.',
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
