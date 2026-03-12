'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Sparkles, Star, Trophy } from 'lucide-react';
import { PRIZE_TIERS, oddsString, isPrizeTier } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide8Prizes({ goTo }: Props) {
  const t = useTranslations('slide8');
  const locale = useLocale();
  const [mainK, setMainK] = useState(5);
  const [starS, setStarS] = useState(2);
  const hasPrize = isPrizeTier(mainK, starS);
  void goTo;

  return (
    <div className="deck-page-shell">
      <div className="w-full max-w-[1100px] space-y-4 sm:space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {mainK} + {starS}
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold text-slate-800 sm:text-[2.6rem]">{t('title')}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-500 sm:text-[1.05rem]">{t('easier')}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="science-panel px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="science-ball h-11 w-11 bg-white text-teal-700">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-slate-800">{t('prizeTiers')}</p>
                <p className="text-sm font-semibold text-slate-500">{t('odds')}</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-teal-700">{t('mainMatched')}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMainK(value)}
                      className={`science-ball aspect-square text-base transition-all sm:text-lg ${
                        mainK === value
                          ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-900/15'
                          : 'bg-white text-slate-600 hover:-translate-y-0.5 hover:border-teal-100 hover:text-teal-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-amber-600">{t('starsMatched')}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStarS(value)}
                      className={`relative flex aspect-square items-center justify-center rounded-[1.45rem] border text-base font-extrabold transition-all sm:text-lg ${
                        starS === value
                          ? 'border-amber-200 bg-gradient-to-br from-amber-200 to-orange-300 text-amber-950 shadow-lg shadow-amber-900/10'
                          : 'border-white/80 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-amber-100 hover:bg-amber-50'
                      }`}
                    >
                      <Star className={`absolute left-2 top-2 h-3.5 w-3.5 ${starS === value ? 'fill-amber-500 text-amber-600' : 'text-slate-300'}`} />
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <motion.div
              key={`${mainK}-${starS}`}
              className={`science-panel px-4 py-4 sm:px-5 ${
                hasPrize ? 'bg-gradient-to-br from-teal-50/90 via-white to-amber-50/80' : 'bg-white/75'
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-bold text-slate-800">{t('odds')}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {mainK} + {starS}
                  </p>
                </div>
                <div className={`science-ball h-12 w-12 ${hasPrize ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {hasPrize ? <Trophy className="h-5 w-5" /> : '?'}
                </div>
              </div>

              <div className="mt-4 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-white/80 px-4 py-4 text-center">
                {hasPrize ? (
                  <p className="font-display text-[2.2rem] font-extrabold text-teal-700 sm:text-[2.8rem]">{oddsString(mainK, starS, locale)}</p>
                ) : (
                  <p className="text-xl font-extrabold text-slate-400">{t('noPrize')}</p>
                )}
              </div>
            </motion.div>

            <div className="science-panel overflow-hidden px-4 py-4 sm:px-5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 text-left font-black uppercase tracking-[0.18em] text-slate-400">{t('mains')}</th>
                      <th className="py-3 text-left font-black uppercase tracking-[0.18em] text-slate-400">{t('stars')}</th>
                      <th className="py-3 text-right font-black uppercase tracking-[0.18em] text-slate-400">{t('odds')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIZE_TIERS.map(([k, s]) => (
                      <tr
                        key={`${k}-${s}`}
                        className={`border-b border-slate-100 transition-colors ${
                          mainK === k && starS === s ? 'bg-teal-50/80' : ''
                        }`}
                      >
                        <td className="py-3 font-display text-lg font-bold text-teal-700">{k}</td>
                        <td className="py-3 font-display text-lg font-bold text-amber-600">{s}</td>
                        <td className="py-3 text-right font-mono font-semibold text-slate-700">{oddsString(k, s, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
