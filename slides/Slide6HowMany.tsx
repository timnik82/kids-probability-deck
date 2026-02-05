'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { comb, MAIN_COUNT, MAIN_PICK, STAR_COUNT, STAR_PICK, TOTAL_OUTCOMES } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide6HowMany({ goTo }: Props) {
  const t = useTranslations('slide6');
  const [showMath, setShowMath] = useState(false);

  const waysMain = comb(MAIN_COUNT, MAIN_PICK);
  const waysStar = comb(STAR_COUNT, STAR_PICK);

  return (
    <div className="flex flex-col items-center gap-5 max-w-2xl mx-auto py-6 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      <div className="w-full space-y-4">
        <motion.div
          className="rounded-2xl bg-white shadow-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-bold text-teal-700 mb-1">{t('waysNumbers')}</p>
          <p className="text-4xl font-extrabold text-teal-600">{waysMain.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="text-center text-3xl font-bold text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          x
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white shadow-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm font-bold text-amber-600 mb-1">{t('waysStars')}</p>
          <p className="text-4xl font-extrabold text-amber-500">{waysStar.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="text-center text-3xl font-bold text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          =
        </motion.div>

        <motion.div
          className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 shadow-xl p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
        >
          <p className="text-sm font-bold text-teal-200 mb-1">{t('total')}</p>
          <p className="text-4xl md:text-5xl font-extrabold text-white">{TOTAL_OUTCOMES.toLocaleString()}</p>
        </motion.div>
      </div>

      <motion.p
        className="text-lg font-bold text-slate-600 bg-slate-100 px-5 py-3 rounded-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        {t('totalSimple')}
      </motion.p>

      <button
        onClick={() => setShowMath(!showMath)}
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all"
      >
        {showMath ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {t('showMath')}
      </button>

      <AnimatePresence>
        {showMath && (
          <motion.div
            className="bg-slate-800 text-teal-300 px-6 py-4 rounded-xl font-mono text-sm space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p>{t('mathC50')}</p>
            <p>{t('mathC12')}</p>
            <p className="text-amber-300 font-bold">{t('mathTotal')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
