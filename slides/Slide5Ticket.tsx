'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, Shuffle, Sparkles, Star, Ticket } from 'lucide-react';
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
  const ready = userMains.length === 5 && userStars.length === 2;

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-6xl space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {userMains.length}/5 • {userStars.length}/2
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl">{t('title')}</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5">
            <section className="science-panel px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="science-ball h-12 w-12 bg-teal-500 text-white">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-slate-800">{t('pickNumbers')}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {userMains.length}/5 {t('selected')}
                    </p>
                  </div>
                </div>
                <span className="science-kicker">{userMains.length}/5</span>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2.5">
                {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => {
                  const isSelected = userMains.includes(n);
                  const isDisabled = userMains.length >= 5 && !isSelected;

                  return (
                    <button
                      key={n}
                      onClick={() => toggleMain(n)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      className={`science-ball aspect-square text-base transition-all sm:text-lg ${
                        isSelected
                          ? 'border-teal-200 bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-900/15'
                          : 'bg-white text-slate-700 hover:-translate-y-0.5 hover:border-teal-100 hover:text-teal-700'
                      } ${isDisabled ? 'cursor-not-allowed opacity-35 hover:translate-y-0 hover:text-slate-700' : ''}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="science-panel px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="science-ball h-12 w-12 bg-amber-300 text-amber-950">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-slate-800">{t('pickStars')}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {userStars.length}/2 {t('selected')}
                    </p>
                  </div>
                </div>
                <span className="science-kicker">{userStars.length}/2</span>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                  const isSelected = userStars.includes(n);
                  const isDisabled = userStars.length >= 2 && !isSelected;

                  return (
                    <button
                      key={n}
                      onClick={() => toggleStar(n)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      className={`relative flex aspect-square items-center justify-center rounded-[1.6rem] border text-lg font-extrabold transition-all ${
                        isSelected
                          ? 'border-amber-200 bg-gradient-to-br from-amber-200 to-orange-300 text-amber-950 shadow-lg shadow-amber-900/10'
                          : 'border-white/80 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-amber-100 hover:bg-amber-50'
                      } ${isDisabled ? 'cursor-not-allowed opacity-35 hover:translate-y-0 hover:bg-white' : ''}`}
                    >
                      <Star className={`absolute left-2 top-2 h-3.5 w-3.5 ${isSelected ? 'fill-amber-500 text-amber-600' : 'text-slate-300'}`} />
                      {n}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="science-panel px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="science-ball h-12 w-12 bg-white text-teal-700">
                  <Shuffle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-800">{t('luckyDip')}</p>
                  <p className="text-sm font-semibold text-slate-500">{t('yourTicket')}</p>
                </div>
              </div>

              <button onClick={luckyDip} className="science-button-primary mt-5 min-h-[58px] w-full">
                <Shuffle className="h-5 w-5" />
                {t('luckyDip')}
              </button>
            </div>

            <motion.div
              className={`science-panel overflow-visible px-5 py-5 sm:px-6 ${
                ready ? 'bg-gradient-to-br from-teal-50/90 via-white to-amber-50/85' : 'bg-white/70'
              }`}
              initial={false}
              animate={{ y: ready ? 0 : 6, opacity: ready ? 1 : 0.88 }}
            >
              <div className="absolute inset-x-6 -top-3 h-7 rounded-full bg-white/70 blur-xl" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-800">{t('yourTicket')}</p>
                  <p className="text-sm font-semibold text-slate-500">
                    {userMains.length}/5 • {userStars.length}/2
                  </p>
                </div>
                {ready && (
                  <div className="science-ball h-11 w-11 bg-teal-500 text-white">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[1.8rem] border border-dashed border-slate-300/80 bg-white/78 px-4 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  {sortedMains.length > 0 ? (
                    sortedMains.map((n) => (
                      <div
                        key={`main-${n}`}
                        className="science-ball h-12 w-12 bg-gradient-to-br from-teal-400 to-teal-600 text-lg text-white"
                      >
                        {n}
                      </div>
                    ))
                  ) : (
                    <PlaceholderRow length={5} />
                  )}
                </div>

                <div className="my-4 h-px bg-slate-200" />

                <div className="flex flex-wrap items-center gap-3">
                  {sortedStars.length > 0 ? (
                    sortedStars.map((n) => (
                      <div key={`star-${n}`} className="relative flex h-12 w-12 items-center justify-center">
                        <Star className="absolute h-full w-full fill-amber-300 text-amber-400" />
                        <span className="relative z-10 font-display text-base font-bold text-amber-950">{n}</span>
                      </div>
                    ))
                  ) : (
                    <PlaceholderRow length={2} star />
                  )}
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PlaceholderRow({ length, star = false }: { length: number; star?: boolean }) {
  return (
    <>
      {Array.from({ length }, (_, index) => (
        <div
          key={`${star ? 'star' : 'main'}-${index}`}
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50 text-slate-300 ${
            star ? 'rounded-[1.4rem]' : ''
          }`}
        >
          {star ? <Star className="h-5 w-5" /> : '•'}
        </div>
      ))}
    </>
  );
}
