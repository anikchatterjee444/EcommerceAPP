import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'Internship project — Next.js + NestJS + Prisma + PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
