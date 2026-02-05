'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, Star } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide12Wrapup({ goTo }: Props) {
  const t = useTranslations('slide12');

  const points = [
    { icon: <BookOpen className="w-5 h-5 text-teal-600" />, text: t('point1') },
    { icon: <Star className="w-5 h-5 text-amber-500" />, text: t('point2') },
    { icon: <span className="text-lg font-bold text-teal-600">#</span>, text: t('point3') },
    { icon: <span className="text-lg">🎯</span>, text: t('point4') },
  ];

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto py-8 w-full">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t('title')}
      </motion.h1>

      <motion.div
        className="w-full rounded-2xl bg-white shadow-lg p-6 space-y-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-sm font-bold text-slate-500 mb-3">{t('learned')}</p>
        {points.map((point, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 py-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <div className="shrink-0 mt-0.5">{point.icon}</div>
            <p className="text-base text-slate-700 font-medium">{point.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="w-full rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 flex items-start gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-base font-bold text-amber-800">{t('adultNote')}</p>
      </motion.div>

      <motion.p
        className="text-2xl font-extrabold text-teal-600 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        {t('thanks')}
      </motion.p>
    </div>
  );
}
