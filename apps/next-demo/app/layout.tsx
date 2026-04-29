import type { Metadata } from 'next';
import '../../../packages/core/src/tokens.css';

export const metadata: Metadata = {
  title: 'Arvea UI Kit — Next.js Demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}