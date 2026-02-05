'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TOTAL_OUTCOMES } from '@/lib/probability';
import { Users, Building, Globe } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

const STOPS = [10, 1000, 1_000_000, TOTAL_OUTCOMES];
const STOP_LABELS_KEY = ['small', 'medium', 'large', 'huge'] as const;

export default function Slide7Jackpot({ goTo }: Props) {
  const t = useTranslations('slide7');
  const [stopIndex, setStopIndex] = useState(0);
  const value = STOPS[stopIndex];

  const icons = [
    <span key="cards" className="text-4xl">🃏</span>,
    <Users key="crowd" className="w-10 h-10 text-teal-600" />,
    <Building key="city" className="w-10 h-10 text-teal-600" />,
    <Globe key="globe" className="w-10 h-10 text-teal-600" />,
  ];

  return (
    <div className="flex flex-col items-center gap-5 max-w-2xl mx-auto py-6 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>
      <p className="text-base text-slate-500 text-center">{t('desc')}</p>

      <motion.div
        className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 shadow-xl p-6 text-center w-full max-w-md"
        key={value}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <p className="text-sm font-bold text-teal-200 mb-1">{t('chance')}</p>
        <p className="text-3xl md:text-4xl font-extrabold text-white">
          {t('oneIn')} {value.toLocaleString()}
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-2">
        <label className="text-sm font-bold text-slate-600 block text-center">
          {t('sliderLabel')} {value.toLocaleString()}
        </label>
        <input
          type="range"
          min={0}
          max={STOPS.length - 1}
          step={1}
          value={stopIndex}
          onChange={(e) => setStopIndex(Number(e.target.value))}
          className="w-full accent-teal-600 h-3 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>10</span>
          <span>1K</span>
          <span>1M</span>
          <span>139M</span>
        </div>
      </div>

      <motion.div
        className="rounded-2xl bg-white shadow-lg p-6 text-center w-full max-w-md flex flex-col items-center gap-3"
        key={`viz-${stopIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {icons[stopIndex]}
        <p className="text-lg font-bold text-slate-700">{t('imagine')}</p>
        <p className="text-base text-slate-500">
          {t(STOP_LABELS_KEY[stopIndex])}
        </p>

        {stopIndex === 0 && (
          <div className="flex flex-wrap gap-1 justify-center max-w-xs">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div
                key={i}
                className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-amber-400' : 'bg-slate-200'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>
        )}

        {stopIndex === 1 && (
          <div className="flex flex-wrap gap-0.5 justify-center max-w-xs">
            {Array.from({ length: 100 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-amber-400' : 'bg-slate-300'}`}
              />
            ))}
            <p className="text-xs text-slate-400 mt-2 w-full">100 / 1,000</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
