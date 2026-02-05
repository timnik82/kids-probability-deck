import { unstable_setRequestLocale } from 'next-intl/server';
import DeckClient from './DeckClient';

export default function DeckPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <DeckClient />;
}
