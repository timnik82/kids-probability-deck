'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Play, Sparkles, Star } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDeck } from '@/lib/deck-context';
import { PRIZE_TIERS } from '@/lib/probability';
import { simulate, type SimResult } from '@/lib/simulate';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide9Simulation({ goTo }: Props) {
  const t = useTranslations('slide9');
  const locale = useLocale();
  const { userMains, userStars } = useDeck();
  const [results, setResults] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const numberFormatter = new Intl.NumberFormat(locale);

  const hasTicket = userMains.length === 5 && userStars.length === 2;

  const runSim = useCallback(
    (count: number) => {
      if (!hasTicket) return;
      setRunning(true);
      setDrawCount(count);
      setTimeout(() => {
        const nextResults = simulate(userMains, userStars, count);
        setResults(nextResults);
        setRunning(false);
      }, 50);
    },
    [hasTicket, userMains, userStars]
  );

  const chartData = results
    ? PRIZE_TIERS.map(([k, s]) => ({
        name: `${k}+${s}`,
        count: results[`${k}+${s}`] || 0,
      })).filter((entry) => entry.count > 0)
    : [];

  const colors = [
    '#0d9488',
    '#14b8a6',
    '#2dd4bf',
    '#5eead4',
    '#99f6e4',
    '#ccfbf1',
    '#f59e0b',
    '#fbbf24',
    '#fcd34d',
    '#fde68a',
    '#fef3c7',
    '#fef9c3',
    '#d4d4d8',
  ];

  return (
    <div className="deck-page-shell">
      <div className="w-full max-w-[1100px] space-y-4 sm:space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {hasTicket ? `${userMains.length} + ${userStars.length}` : '?'}
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold text-slate-800 sm:text-[2.6rem]">{t('title')}</h1>
        </div>

        {!hasTicket ? (
          <div className="science-panel mx-auto max-w-xl px-5 py-6 text-center">
            <div className="science-ball mx-auto h-12 w-12 bg-amber-300 text-amber-950">
              <ArrowLeft className="h-6 w-6" />
            </div>
            <p className="mt-5 text-lg font-bold text-amber-700">{t('noTicket')}</p>
            <button type="button" onClick={() => goTo(5)} className="science-button-secondary mt-5 min-h-[54px]">
              <ArrowLeft className="h-5 w-5" />
              {t('goBack')}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-4">
              <div className="science-panel px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="science-ball h-11 w-11 bg-teal-500 text-white">
                    <Play className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-slate-800">{t('results')}</p>
                    <p className="text-sm font-semibold text-slate-500">{t('desc')}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  {[1000, 10000, 50000].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => runSim(count)}
                      disabled={running}
                      className="science-button-primary min-h-[54px] w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      {numberFormatter.format(count)} {t('draws')}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-white/80 px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {userMains.map((value) => (
                      <div
                        key={`ticket-main-${value}`}
                        className="science-ball h-10 w-10 bg-gradient-to-br from-teal-400 to-teal-600 text-sm text-white"
                      >
                        {value}
                      </div>
                    ))}
                  </div>

                  <div className="my-4 h-px bg-slate-200" />

                  <div className="flex flex-wrap gap-2.5">
                    {userStars.map((value) => (
                      <div key={`ticket-star-${value}`} className="relative flex h-10 w-10 items-center justify-center">
                        <Star className="absolute h-full w-full fill-amber-300 text-amber-400" />
                        <span className="relative z-10 font-display text-sm font-extrabold text-amber-950">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {running && (
                <motion.div
                  className="science-panel bg-teal-50/85 px-4 py-3.5 text-center"
                  animate={{ opacity: [1, 0.55, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <p className="text-base font-bold text-teal-700 sm:text-lg">{t('running')}</p>
                </motion.div>
              )}

              {results && !running && (
                <div className="science-panel bg-amber-50/85 px-4 py-4">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">{t('draws')}</p>
                  <p className="mt-2 font-display text-[1.9rem] font-extrabold text-slate-800 sm:text-3xl">{numberFormatter.format(drawCount)}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-amber-900">{t('jackpotNote')}</p>
                </div>
              )}
            </section>

            <section className="science-panel overflow-visible px-4 py-4 sm:px-5 sm:py-5">
              <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-teal-200/[.36] blur-3xl" />
              <div className="absolute right-8 top-8 h-20 w-20 rounded-full bg-amber-200/[.34] blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-slate-800">{t('results')}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {results && !running ? `${numberFormatter.format(drawCount)} ${t('draws')}` : t('desc')}
                    </p>
                  </div>
                  <div className="science-kicker">{chartData.length}</div>
                </div>

                <div className="mt-4 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-white/80 p-3.5 sm:p-4">
                  {results && !running ? (
                    chartData.length > 0 ? (
                      <div className="h-64 w-full sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                              {chartData.map((_, index) => (
                                <Cell key={index} fill={colors[index % colors.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center sm:h-72">
                        <p className="max-w-sm text-center text-xl font-extrabold leading-8 text-slate-400">{t('noWins')}</p>
                      </div>
                    )
                  ) : (
                    <div className="flex h-64 items-center justify-center sm:h-72">
                      <p className="max-w-sm text-center text-base font-semibold leading-7 text-slate-500">{t('desc')}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
