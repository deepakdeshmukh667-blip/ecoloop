import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | AI Waste Verification',
  description: 'AI optical waste classification studio. Real-time segregation validation and instant points.',
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
