import type { Metadata } from 'next';
import Providers from '@/providers/Providers';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Adaptive Moderation — Decision Support Interface',
  description:
    'Real-time decision-support interface for AI-driven content moderation under uncertainty.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
