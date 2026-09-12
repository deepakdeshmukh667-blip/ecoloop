import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/state/store';
import SpotCheckModal from '@/components/SpotCheckModal';
import RewardModal from '@/components/RewardModal';

export const metadata: Metadata = {
  title: 'EcoLoop — Gamified Waste Segregation & Society Habit Platform',
  description:
    'Turn daily household waste sorting into an intuitive, rewarding micro-routine. Zero landfill pledge for sustainable residential communities.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background dark:bg-[#0b1120] text-on-surface dark:text-[#f8fafc] antialiased min-h-screen">
        <AppProvider>
          {children}
          <SpotCheckModal />
          <RewardModal />
        </AppProvider>
      </body>
    </html>
  );
}
