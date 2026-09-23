import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLoop | Eco Rewards & Vouchers',
  description: 'Redeem eco points for artisan café vouchers, maintenance fee discounts, and society rewards.',
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
