import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Probability Deck',
  description: 'Learn probability with EuroMillions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
