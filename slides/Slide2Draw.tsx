'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Star } from 'lucide-react';
import { drawOnce } from '@/lib/simulate';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide2Draw({ goTo }: Props) {
  const t = useTranslations('slide2');
  const [drawn, setDrawn] = useState<{ mains: number[]; stars: number[] } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDraw = useCallback(() => {
    setIsAnimating(true);
    setDrawn(null);
    setTimeout(() => {
      setDrawn(drawOnce());
      setIsAnimating(false);
    }, 800);
  }, []);

  const handleReset = useCallback(() => {
    setDrawn(null);
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto py-6">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-slate-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t('title')}
      </motion.h1>

      <p className="text-base text-slate-500">{t('desc')}</p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 p-5 min-h-[180px]">
          <p className="text-sm font-bold text-teal-700 mb-3">{t('numbersLabel')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[60px]">
            {isAnimating && (
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: 3, duration: 0.25 }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-teal-300 animate-pulse" />
                ))}
              </motion.div>
            )}
            <AnimatePresence>
              {drawn &&
                drawn.mains
                  .sort((a, b) => a - b)
                  .map((n, i) => (
                    <motion.div
                      key={`m-${n}`}
                      className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md"
                      initial={{ scale: 0, y: -30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
                    >
                      {n}
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 p-5 min-h-[180px]">
          <p className="text-sm font-bold text-amber-700 mb-3">{t('starsLabel')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 min-h-[60px]">
            {isAnimating && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: 3, duration: 0.25 }}
              >
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-amber-300 animate-pulse" />
                ))}
              </motion.div>
            )}
            <AnimatePresence>
              {drawn &&
                drawn.stars
                  .sort((a, b) => a - b)
                  .map((s, i) => (
                    <motion.div
                      key={`s-${s}`}
                      className="relative w-14 h-14 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
                    >
                      <Star className="w-14 h-14 text-amber-400 fill-amber-400 absolute" />
                      <span className="relative z-10 text-lg font-bold text-amber-900">{s}</span>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDraw}
          disabled={isAnimating}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-teal-600 text-white text-lg font-bold shadow-lg
            hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          {t('draw')}
        </button>
        {drawn && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-200 text-slate-700 text-lg font-bold
              hover:bg-slate-300 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            {t('reset')}
          </button>
        )}
      </div>

      <motion.p
        className="text-base font-semibold text-rose-500 bg-rose-50 px-4 py-2 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t('noBallTwice')}
      </motion.p>
    </div>
  );
}
