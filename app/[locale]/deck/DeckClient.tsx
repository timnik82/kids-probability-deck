'use client';

import { Suspense } from 'react';
import { DeckProvider } from '@/lib/deck-context';
import DeckShell from '@/components/Deck/DeckShell';
import SlideRenderer from '@/components/Deck/SlideRenderer';

function DeckContent() {
  return (
    <DeckProvider>
      <DeckShell>
        {(current, goTo) => <SlideRenderer current={current} goTo={goTo} />}
      </DeckShell>
    </DeckProvider>
  );
}

export default function DeckClient() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
          <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <DeckContent />
    </Suspense>
  );
}
