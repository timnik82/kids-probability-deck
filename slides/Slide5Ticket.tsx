'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, Shuffle, Sparkles, Star, Ticket } from 'lucide-react';
import { useDeck } from '@/lib/deck-context';
import { MAIN_COUNT, MAIN_PICK, STAR_COUNT, STAR_PICK } from '@/lib/probability';

export default function Slide5Ticket() {
  const t = useTranslations('slide5');
  const { userMains, userStars, setUserMains, setUserStars } = useDeck();

  const toggleMain = useCallback(
    (n: number) => {
      if (userMains.includes(n)) {
        setUserMains(userMains.filter((x) => x !== n));
      } else if (userMains.length < MAIN_PICK) {
        setUserMains([...userMains, n]);
      }
    },
    [userMains, setUserMains]
  );

  const toggleStar = useCallback(
    (n: number) => {
      if (userStars.includes(n)) {
        setUserStars(userStars.filter((x) => x !== n));
      } else if (userStars.length < STAR_PICK) {
        setUserStars([...userStars, n]);
      }
    },
    [userStars, setUserStars]
  );

  const luckyDip = useCallback(() => {
    const pool = Array.from({ length: MAIN_COUNT }, (_, i) => i + 1);
    const mains: number[] = [];
    for (let i = 0; i < MAIN_PICK; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      mains.push(pool[idx]);
      pool.splice(idx, 1);
    }
    setUserMains(mains.sort((a, b) => a - b));

    const starPool = Array.from({ length: STAR_COUNT }, (_, i) => i + 1);
    const stars: number[] = [];
    for (let i = 0; i < STAR_PICK; i++) {
      const idx = Math.floor(Math.random() * starPool.length);
      stars.push(starPool[idx]);
      starPool.splice(idx, 1);
    }
    setUserStars(stars.sort((a, b) => a - b));
  }, [setUserMains, setUserStars]);

  const sortedMains = [...userMains].sort((a, b) => a - b);
  const sortedStars = [...userStars].sort((a, b) => a - b);
  const ready = userMains.length === MAIN_PICK && userStars.length === STAR_PICK;

  return (
    <div className="deck-page-shell">
      <div className="w-full max-w-[1100px] space-y-4 sm:space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {userMains.length}/{MAIN_PICK} • {userStars.length}/{STAR_PICK}
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold text-slate-800 sm:text-[2.6rem]">{t('title')}</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.24fr_0.76fr]">
          <div className="space-y-4">
            <section className="science-panel px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="science-ball h-11 w-11 bg-teal-500 text-white">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-800">{t('pickNumbers')}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {userMains.length}/{MAIN_PICK} {t('selected')}
                    </p>
                  </div>
                </div>
                <span className="science-kicker">{userMains.length}/{MAIN_PICK}</span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2">
                {Array.from({ length: MAIN_COUNT }, (_, i) => i + 1).map((n) => {
                  const isSelected = userMains.includes(n);
                  const isDisabled = userMains.length >= MAIN_PICK && !isSelected;

                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => toggleMain(n)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      className={`science-ball aspect-square text-sm transition-all sm:text-base ${
                        isSelected
                          ? 'border-teal-200 bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-900/15'
                          : `bg-white text-slate-700 ${!isDisabled ? 'hover:-translate-y-0.5 hover:border-teal-100 hover:text-teal-700' : ''}`
                      } ${isDisabled ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="science-panel px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="science-ball h-11 w-11 bg-amber-300 text-amber-950">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-800">{t('pickStars')}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {userStars.length}/{STAR_PICK} {t('selected')}
                    </p>
                  </div>
                </div>
                <span className="science-kicker">{userStars.length}/{STAR_PICK}</span>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
                {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((n) => {
                  const isSelected = userStars.includes(n);
                  const isDisabled = userStars.length >= STAR_PICK && !isSelected;

                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => toggleStar(n)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      className={`relative flex aspect-square items-center justify-center rounded-[1.35rem] border text-base font-extrabold transition-all sm:text-lg ${
                        isSelected
                          ? 'border-amber-200 bg-gradient-to-br from-amber-200 to-orange-300 text-amber-950 shadow-lg shadow-amber-900/10'
                          : `border-white/80 bg-white text-slate-700 ${!isDisabled ? 'hover:-translate-y-0.5 hover:border-amber-100 hover:bg-amber-50' : ''}`
                      } ${isDisabled ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      <Star className={`absolute left-2 top-2 h-3.5 w-3.5 ${isSelected ? 'fill-amber-500 text-amber-600' : 'text-slate-300'}`} />
                      {n}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="science-panel px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="science-ball h-11 w-11 bg-white text-teal-700">
                  <Shuffle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-slate-800">{t('luckyDip')}</p>
                  <p className="text-sm font-semibold text-slate-500">{t('yourTicket')}</p>
                </div>
              </div>

              <button type="button" onClick={luckyDip} className="science-button-primary mt-4 min-h-[54px] w-full">
                <Shuffle className="h-5 w-5" />
                {t('luckyDip')}
              </button>
            </div>

            <motion.div
              className={`science-panel overflow-visible px-4 py-4 sm:px-5 ${
                ready ? 'bg-gradient-to-br from-teal-50/90 via-white to-amber-50/85' : 'bg-white/70'
              }`}
              initial={false}
              animate={{ y: ready ? 0 : 6, opacity: ready ? 1 : 0.88 }}
            >
              <div className="absolute inset-x-6 -top-3 h-7 rounded-full bg-white/70 blur-xl" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-bold text-slate-800">{t('yourTicket')}</p>
                  <p className="text-sm font-semibold text-slate-500">
                    {userMains.length}/{MAIN_PICK} • {userStars.length}/{STAR_PICK}
                  </p>
                </div>
                {ready && (
                  <div className="science-ball h-10 w-10 bg-teal-500 text-white">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-white/[0.78] px-4 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  {sortedMains.length > 0 ? (
                    sortedMains.map((n) => (
                      <div
                        key={`main-${n}`}
                        className="science-ball h-10 w-10 bg-gradient-to-br from-teal-400 to-teal-600 text-base text-white"
                      >
                        {n}
                      </div>
                    ))
                  ) : (
                    <PlaceholderRow length={MAIN_PICK} />
                  )}
                </div>

                <div className="my-4 h-px bg-slate-200" />

                <div className="flex flex-wrap items-center gap-3">
                  {sortedStars.length > 0 ? (
                    sortedStars.map((n) => (
                      <div key={`star-${n}`} className="relative flex h-10 w-10 items-center justify-center">
                        <Star className="absolute h-full w-full fill-amber-300 text-amber-400" />
                        <span className="relative z-10 font-display text-sm font-bold text-amber-950">{n}</span>
                      </div>
                    ))
                  ) : (
                    <PlaceholderRow length={STAR_PICK} star />
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
          className={`flex h-10 w-10 items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-slate-300 ${
            star ? 'rounded-[1.4rem]' : 'rounded-full'
          }`}
        >
          {star ? <Star className="h-5 w-5" /> : '•'}
        </div>
      ))}
    </>
  );
}
