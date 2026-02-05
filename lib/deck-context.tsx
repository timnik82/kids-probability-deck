'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface DeckState {
  userMains: number[];
  userStars: number[];
  setUserMains: (nums: number[]) => void;
  setUserStars: (nums: number[]) => void;
}

const DeckContext = createContext<DeckState | null>(null);

export function DeckProvider({ children }: { children: ReactNode }) {
  const [userMains, setUserMains] = useState<number[]>([]);
  const [userStars, setUserStars] = useState<number[]>([]);

  return (
    <DeckContext.Provider value={{ userMains, userStars, setUserMains, setUserStars }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeck must be used within DeckProvider');
  return ctx;
}
