'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TOTAL_OUTCOMES } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide10Special({ goTo }: Props) {
  const t = useTranslations('slide10');
  const [mode, setMode] = useState<'birthday' | 'random'>('birthday');

  const odds = `1 : ${TOTAL_OUTCOMES.toLocaleString()}`;

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto py-6 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      <div className="flex gap-3">
        <button
          onClick={() => setMode('birthday')}
          className={`px-6 py-3 rounded-xl font-bold text-base transition-all active:scale-95 ${
            mode === 'birthday'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-amber-300'
          }`}
        >
          {t('birthday')}
        </button>
        <button
          onClick={() => setMode('random')}
          className={`px-6 py-3 rounded-xl font-bold text-base transition-all active:scale-95 ${
            mode === 'random'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-teal-300'
          }`}
        >
          {t('random')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <motion.div
          className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 p-5 text-center"
          key={`bday-${mode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm font-bold text-amber-700 mb-1">{t('birthday')}</p>
          <p className="text-sm text-slate-500 mb-2">(1–31)</p>
          <p className="text-xl font-extrabold text-amber-600">{t('jackpotOdds')}</p>
          <p className="text-lg font-bold text-slate-700 mt-1">{odds}</p>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 p-5 text-center"
          key={`rand-${mode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm font-bold text-teal-700 mb-1">{t('random')}</p>
          <p className="text-sm text-slate-500 mb-2">(1–50)</p>
          <p className="text-xl font-extrabold text-teal-600">{t('jackpotOdds')}</p>
          <p className="text-lg font-bold text-slate-700 mt-1">{odds}</p>
        </motion.div>
      </div>

      <motion.div
        className="rounded-2xl bg-teal-600 text-white p-5 text-center max-w-md shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xl font-extrabold mb-2">{t('sameChance')}</p>
        <p className="text-sm opacity-90">{t('note')}</p>
      </motion.div>

      <p className="text-sm text-slate-400 text-center max-w-md">{t('shareNote')}</p>
    </div>
  );
}
