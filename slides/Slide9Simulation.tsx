'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDeck } from '@/lib/deck-context';
import { simulate, type SimResult } from '@/lib/simulate';
import { PRIZE_TIERS } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide9Simulation({ goTo }: Props) {
  const t = useTranslations('slide9');
  const { userMains, userStars } = useDeck();
  const [results, setResults] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);
  const [drawCount, setDrawCount] = useState(0);

  const hasTicket = userMains.length === 5 && userStars.length === 2;

  const runSim = useCallback(
    (n: number) => {
      if (!hasTicket) return;
      setRunning(true);
      setDrawCount(n);
      setTimeout(() => {
        const res = simulate(userMains, userStars, n);
        setResults(res);
        setRunning(false);
      }, 50);
    },
    [hasTicket, userMains, userStars]
  );

  const chartData = results
    ? PRIZE_TIERS.map(([k, s]) => ({
        name: `${k}+${s}`,
        count: results[`${k}+${s}`] || 0,
      })).filter((d) => d.count > 0)
    : [];

  const colors = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1',
    '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7', '#fef9c3', '#d4d4d8'];

  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto py-4 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      {!hasTicket ? (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-6 text-center space-y-3">
          <p className="text-base font-bold text-amber-700">{t('noTicket')}</p>
          <button
            onClick={() => goTo(5)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-bold mx-auto
              hover:bg-amber-600 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('goBack')}
          </button>
        </div>
      ) : (
        <>
          <p className="text-base text-slate-500 text-center">{t('desc')}</p>

          <div className="flex gap-2 flex-wrap justify-center">
            {[1000, 10000, 50000].map((n) => (
              <button
                key={n}
                onClick={() => runSim(n)}
                disabled={running}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-bold
                  hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {n.toLocaleString()} {t('draws')}
              </button>
            ))}
          </div>

          {running && (
            <motion.div
              className="text-lg font-bold text-teal-600"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              {t('running')}
            </motion.div>
          )}

          {results && !running && (
            <motion.div
              className="w-full space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-bold text-slate-600 text-center">
                {t('results')} ({drawCount.toLocaleString()} {t('draws')})
              </p>

              {chartData.length > 0 ? (
                <div className="w-full h-64 rounded-2xl bg-white shadow-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={colors[i % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-slate-400 font-bold">0 wins!</p>
              )}

              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-center">
                <p className="text-sm font-bold text-rose-600">{t('jackpotNote')}</p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
