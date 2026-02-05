'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { allPairsFrom5 } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide4Combinations({ goTo }: Props) {
  const t = useTranslations('slide4');
  const [picked, setPicked] = useState<number[]>([]);
  const [showMath, setShowMath] = useState(false);
  const allPairs = allPairsFrom5();

  const toggle = (n: number) => {
    if (picked.includes(n)) {
      setPicked(picked.filter((x) => x !== n));
    } else if (picked.length < 2) {
      setPicked([...picked, n]);
    }
  };

  const pickedSorted = [...picked].sort((a, b) => a - b);
  const isMatch = (pair: number[]) =>
    picked.length === 2 && pair[0] === pickedSorted[0] && pair[1] === pickedSorted[1];

  return (
    <div className="flex flex-col items-center gap-5 max-w-2xl mx-auto py-4 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>
      <p className="text-base text-slate-500 text-center">{t('desc')}</p>

      <div className="space-y-3 w-full max-w-sm">
        <p className="text-sm font-bold text-slate-600 text-center">{t('pickTwo')}</p>
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => toggle(n)}
              className={`w-14 h-14 rounded-full text-xl font-bold transition-all active:scale-90 shadow ${
                picked.includes(n)
                  ? 'bg-teal-500 text-white shadow-teal-200 scale-110'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-teal-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {picked.length === 2 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg font-bold text-slate-700">
              {t('yourPick')}: {picked[0]}-{picked[1]} = {pickedSorted[0]}-{pickedSorted[1]}
            </p>
            {picked[0] !== pickedSorted[0] && (
              <p className="text-sm text-teal-600 font-semibold">{t('sameTicket')}</p>
            )}
          </motion.div>
        )}
      </div>

      <div className="w-full rounded-2xl bg-white shadow-lg p-5 space-y-3">
        <p className="text-sm font-bold text-slate-600 text-center">{t('allPairs')}</p>
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {allPairs.map((pair, i) => (
            <motion.div
              key={pair.join('-')}
              className={`px-3 py-2 rounded-lg text-center text-sm font-bold transition-all ${
                isMatch(pair)
                  ? 'bg-teal-500 text-white shadow-md scale-110'
                  : 'bg-slate-100 text-slate-600'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: isMatch(pair) ? 1.1 : 1 }}
              transition={{ delay: i * 0.04 }}
            >
              {pair[0]}-{pair[1]}
            </motion.div>
          ))}
        </div>
      </div>

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
            className="bg-slate-800 text-teal-300 px-6 py-3 rounded-xl font-mono text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {t('mathExplain')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
