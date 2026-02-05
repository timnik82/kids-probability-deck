import type { Metadata } from 'next';

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
