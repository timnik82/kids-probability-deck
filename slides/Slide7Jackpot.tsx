'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Building, Globe, Sparkles, Users } from 'lucide-react';
import { TOTAL_OUTCOMES } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

const STOPS = [10, 1000, 1_000_000, TOTAL_OUTCOMES];
const STOP_LABELS_KEY = ['small', 'medium', 'large', 'huge'] as const;

export default function Slide7Jackpot({ goTo }: Props) {
  const t = useTranslations('slide7');
  const locale = useLocale();
  const [stopIndex, setStopIndex] = useState(0);
  const value = STOPS[stopIndex];
  void goTo;
  const numberFormatter = new Intl.NumberFormat(locale);

  const icons = [
    <span key="cards" className="text-4xl">🃏</span>,
    <Users key="crowd" className="h-10 w-10 text-teal-600" />,
    <Building key="city" className="h-10 w-10 text-teal-600" />,
    <Globe key="globe" className="h-10 w-10 text-teal-600" />,
  ];

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-6xl space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {t('chance')}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-500 sm:text-lg">{t('desc')}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5">
            <motion.div
              className="science-panel overflow-visible bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 px-6 py-6 text-white sm:px-7"
              key={value}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="absolute inset-x-8 -top-4 h-12 rounded-full bg-white/25 blur-3xl" />
              <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-100">{t('chance')}</p>
              <p className="mt-4 font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">
                {t('oneIn')} {numberFormatter.format(value)}
              </p>
            </motion.div>

            <section className="science-panel px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-800">{t('sliderLabel')}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{numberFormatter.format(value)}</p>
                </div>
                <div className="science-kicker">{numberFormatter.format(value)}</div>
              </div>

              <div className="mt-5">
                <input
                  type="range"
                  min={0}
                  max={STOPS.length - 1}
                  step={1}
                  value={stopIndex}
                  onChange={(e) => setStopIndex(Number(e.target.value))}
                  className="science-range"
                />
                <div className="mt-3 flex justify-between text-[10px] font-bold tracking-[0.08em] text-slate-400 sm:text-xs">
                  {STOPS.map((stop) => (
                    <span key={`tick-${stop}`}>{numberFormatter.format(stop)}</span>
                  ))}
                </div>
              </div>
            </section>
          </section>

          <motion.section
            key={`viz-${stopIndex}`}
            className="science-panel overflow-visible px-5 py-5 sm:px-6 sm:py-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute left-10 top-8 h-24 w-24 rounded-full bg-teal-200/45 blur-3xl" />
            <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="science-ball h-12 w-12 bg-white text-teal-700">{icons[stopIndex]}</div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-800">{t('imagine')}</p>
                  <p className="text-sm font-semibold text-slate-500">{t(STOP_LABELS_KEY[stopIndex])}</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.9rem] border border-dashed border-slate-300/80 bg-white/80 px-4 py-5">
                <div className="flex flex-col items-center gap-4 text-center">
                  {icons[stopIndex]}
                  <p className="max-w-md text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                    {t(STOP_LABELS_KEY[stopIndex])}
                  </p>

                  {stopIndex === 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {Array.from({ length: 10 }, (_, index) => (
                        <motion.div
                          key={index}
                          className={`h-9 w-9 rounded-[1rem] ${index === 0 ? 'bg-amber-300' : 'bg-slate-200'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        />
                      ))}
                    </div>
                  )}

                  {stopIndex === 1 && (
                    <div className="flex max-w-sm flex-wrap justify-center gap-1">
                      {Array.from({ length: 100 }, (_, index) => (
                        <div
                          key={index}
                          className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-amber-400' : 'bg-slate-300'}`}
                        />
                      ))}
                    </div>
                  )}

                  {stopIndex >= 2 && (
                    <div className="grid w-full max-w-sm grid-cols-6 gap-2 sm:grid-cols-8">
                      {Array.from({ length: stopIndex === 2 ? 24 : 32 }, (_, index) => (
                        <div
                          key={index}
                          className={`h-7 rounded-full ${index === 0 ? 'bg-amber-300' : 'bg-slate-200/90'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
