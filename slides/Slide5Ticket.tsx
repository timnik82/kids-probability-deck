'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shuffle, Star } from 'lucide-react';
import { useDeck } from '@/lib/deck-context';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide5Ticket({ goTo }: Props) {
  const t = useTranslations('slide5');
  const { userMains, userStars, setUserMains, setUserStars } = useDeck();

  const toggleMain = useCallback(
    (n: number) => {
      if (userMains.includes(n)) {
        setUserMains(userMains.filter((x) => x !== n));
      } else if (userMains.length < 5) {
        setUserMains([...userMains, n]);
      }
    },
    [userMains, setUserMains]
  );

  const toggleStar = useCallback(
    (n: number) => {
      if (userStars.includes(n)) {
        setUserStars(userStars.filter((x) => x !== n));
      } else if (userStars.length < 2) {
        setUserStars([...userStars, n]);
      }
    },
    [userStars, setUserStars]
  );

  const luckyDip = useCallback(() => {
    const pool = Array.from({ length: 50 }, (_, i) => i + 1);
    const mains: number[] = [];
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      mains.push(pool[idx]);
      pool.splice(idx, 1);
    }
    setUserMains(mains.sort((a, b) => a - b));

    const starPool = Array.from({ length: 12 }, (_, i) => i + 1);
    const stars: number[] = [];
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * starPool.length);
      stars.push(starPool[idx]);
      starPool.splice(idx, 1);
    }
    setUserStars(stars.sort((a, b) => a - b));
  }, [setUserMains, setUserStars]);

  const sortedMains = [...userMains].sort((a, b) => a - b);
  const sortedStars = [...userStars].sort((a, b) => a - b);

  return (
    <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto py-4 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      <div className="w-full space-y-4">
        <div className="rounded-2xl bg-white shadow-lg p-4">
          <p className="text-sm font-bold text-teal-700 mb-2">
            {t('pickNumbers')} ({userMains.length}/5 {t('selected')})
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => toggleMain(n)}
                className={`aspect-square rounded-lg text-sm font-bold transition-all active:scale-90 ${
                  userMains.includes(n)
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-teal-100'
                } ${userMains.length >= 5 && !userMains.includes(n) ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-lg p-4">
          <p className="text-sm font-bold text-amber-600 mb-2">
            {t('pickStars')} ({userStars.length}/2 {t('selected')})
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => toggleStar(n)}
                className={`w-12 h-12 rounded-xl text-base font-bold transition-all active:scale-90 flex items-center justify-center ${
                  userStars.includes(n)
                    ? 'bg-amber-400 text-amber-900 shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-100'
                } ${userStars.length >= 2 && !userStars.includes(n) ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={luckyDip}
        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-500 text-white text-lg font-bold
          hover:bg-amber-600 active:scale-95 transition-all shadow-lg"
      >
        <Shuffle className="w-5 h-5" />
        {t('luckyDip')}
      </button>

      {userMains.length === 5 && userStars.length === 2 && (
        <motion.div
          className="w-full max-w-md rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 p-5 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-bold text-teal-200 mb-3 text-center">{t('yourTicket')}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {sortedMains.map((n) => (
              <div key={`t-${n}`} className="w-12 h-12 rounded-full bg-white text-teal-700 flex items-center justify-center text-lg font-bold shadow">
                {n}
              </div>
            ))}
            <div className="w-px h-10 bg-teal-400 mx-1" />
            {sortedStars.map((s) => (
              <div key={`s-${s}`} className="relative w-12 h-12 flex items-center justify-center">
                <Star className="w-12 h-12 text-amber-400 fill-amber-400 absolute" />
                <span className="relative z-10 text-sm font-bold text-amber-900">{s}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
