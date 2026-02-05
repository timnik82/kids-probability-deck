'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Circle, Star } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide1WhatIs({ goTo }: Props) {
  const t = useTranslations('slide1');

  const sampleNumbers = [7, 14, 23, 38, 45];
  const sampleStars = [3, 9];

  return (
    <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto py-8">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-slate-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t('title')}
      </motion.h1>

      <motion.p
        className="text-lg text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {t('p1')}
      </motion.p>

      <motion.div
        className="w-full rounded-2xl bg-white shadow-lg p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <p className="text-sm font-semibold text-teal-700 mb-3">{t('p2')}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {sampleNumbers.map((n, i) => (
              <motion.div
                key={n}
                className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              >
                {n}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-amber-600 mb-3">{t('p3')}</p>
          <div className="flex items-center justify-center gap-3">
            {sampleStars.map((s, i) => (
              <motion.div
                key={s}
                className="relative w-14 h-14 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + i * 0.15, type: 'spring' }}
              >
                <Star className="w-14 h-14 text-amber-400 fill-amber-400 absolute" />
                <span className="relative z-10 text-lg font-bold text-amber-900">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-base text-slate-500 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {t('p4')}
      </motion.p>
    </div>
  );
}
