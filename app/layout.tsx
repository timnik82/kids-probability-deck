import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kids Probability Deck',
  description: 'A playful learning deck for kids to explore probability and understand how lotteries work.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
