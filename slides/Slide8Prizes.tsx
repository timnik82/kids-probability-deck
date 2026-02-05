'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { PRIZE_TIERS, oddsString, isPrizeTier } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide8Prizes({ goTo }: Props) {
  const t = useTranslations('slide8');
  const [mainK, setMainK] = useState(5);
  const [starS, setStarS] = useState(2);
  const hasPrize = isPrizeTier(mainK, starS);

  return (
    <div className="flex flex-col items-center gap-5 max-w-2xl mx-auto py-4 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      <div className="w-full rounded-2xl bg-white shadow-lg p-5 space-y-4">
        <div>
          <p className="text-sm font-bold text-teal-700 mb-2">{t('mainMatched')}</p>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMainK(n)}
                className={`w-12 h-12 rounded-xl text-lg font-bold transition-all active:scale-90 ${
                  mainK === n ? 'bg-teal-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-teal-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-amber-600 mb-2">{t('starsMatched')}</p>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                onClick={() => setStarS(n)}
                className={`w-12 h-12 rounded-xl text-lg font-bold transition-all active:scale-90 ${
                  starS === n ? 'bg-amber-400 text-amber-900 shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-amber-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={`${mainK}-${starS}`}
          className={`rounded-xl p-4 text-center ${hasPrize ? 'bg-teal-50 border-2 border-teal-200' : 'bg-slate-50 border-2 border-slate-200'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm font-bold text-slate-500 mb-1">{t('odds')}</p>
          {hasPrize ? (
            <p className="text-2xl font-extrabold text-teal-700">{oddsString(mainK, starS)}</p>
          ) : (
            <p className="text-lg font-bold text-slate-400">{t('noPrize')}</p>
          )}
        </motion.div>
      </div>

      <p className="text-sm text-slate-500 text-center">{t('easier')}</p>

      <div className="w-full rounded-2xl bg-white shadow-lg p-4 overflow-x-auto">
        <p className="text-sm font-bold text-slate-600 mb-3 text-center">{t('prizeTiers')}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 text-left text-slate-500 font-semibold">{t('mains')}</th>
              <th className="py-2 text-left text-slate-500 font-semibold">{t('stars')}</th>
              <th className="py-2 text-right text-slate-500 font-semibold">{t('odds')}</th>
            </tr>
          </thead>
          <tbody>
            {PRIZE_TIERS.map(([k, s]) => (
              <tr
                key={`${k}-${s}`}
                className={`border-b border-slate-100 transition-colors ${
                  mainK === k && starS === s ? 'bg-teal-50' : ''
                }`}
              >
                <td className="py-2 font-bold text-teal-700">{k}</td>
                <td className="py-2 font-bold text-amber-600">{s}</td>
                <td className="py-2 text-right font-mono text-slate-700">{oddsString(k, s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
