import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shop Management ERP',
  description: 'A modular shop management ERP foundation for retail operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
