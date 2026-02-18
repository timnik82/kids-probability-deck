import { setRequestLocale } from 'next-intl/server';
import DeckClient from './DeckClient';

export default function DeckPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <DeckClient />;
}
