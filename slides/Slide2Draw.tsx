'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Play, RotateCcw, Sparkles, Star } from 'lucide-react';
import { drawOnce } from '@/lib/simulate';

interface Props {
  goTo: (n: number) => void;
}

type DrawResult = { mains: number[]; stars: number[] } | null;

export default function Slide2Draw({ goTo }: Props) {
  const t = useTranslations('slide2');
  const [drawn, setDrawn] = useState<DrawResult>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleDraw = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setIsAnimating(true);
    setDrawn(null);
    timeoutRef.current = window.setTimeout(() => {
      setDrawn(drawOnce());
      setIsAnimating(false);
      timeoutRef.current = null;
    }, 800);
  }, []);

  const handleReset = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsAnimating(false);
    setDrawn(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sortedMains = drawn ? [...drawn.mains].sort((a, b) => a - b) : [];
  const sortedStars = drawn ? [...drawn.stars].sort((a, b) => a - b) : [];

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-6xl space-y-5">
        <div className="text-center">
          <motion.div
            className="science-kicker mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            5 + 2
          </motion.div>
          <motion.h1
            className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-600"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            {t('desc')}
          </motion.p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
          <section className="science-panel px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-800">{t('draw')}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{t('noBallTwice')}</p>
              </div>
              <div className="science-kicker">5 + 2</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MachineCard
                label={t('numbersLabel')}
                values={sortedMains}
                isAnimating={isAnimating}
                tone="teal"
              />
              <MachineCard
                label={t('starsLabel')}
                values={sortedStars}
                isAnimating={isAnimating}
                tone="amber"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleDraw}
                disabled={isAnimating}
                className="science-button-primary min-h-[58px] px-7 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="h-5 w-5" />
                {t('draw')}
              </button>
              {drawn && (
                <button
                  onClick={handleReset}
                  className="science-button-secondary min-h-[58px] px-6"
                >
                  <RotateCcw className="h-5 w-5" />
                  {t('reset')}
                </button>
              )}
            </div>
          </section>

          <motion.aside
            className="science-panel overflow-visible px-5 py-5 sm:px-6 sm:py-6"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.32 }}
          >
            <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-amber-200/45 blur-3xl" />
            <div className="absolute left-10 top-16 h-24 w-24 rounded-full bg-teal-200/45 blur-3xl" />

            <div className="relative rounded-[2rem] border border-slate-200/80 bg-white/[0.88] px-4 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-800">{t('draw')}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{t('desc')}</p>
                </div>
                <div className="science-kicker">
                  {drawn ? `${sortedMains.length} + ${sortedStars.length}` : isAnimating ? '...' : '0 + 0'}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <ReadoutRow
                  label={t('numbersLabel')}
                  values={sortedMains}
                  placeholder="-- -- -- -- --"
                  tone="teal"
                />
                <ReadoutRow
                  label={t('starsLabel')}
                  values={sortedStars}
                  placeholder="-- --"
                  tone="amber"
                />
              </div>

              <div className="mt-5 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-slate-50/85 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="science-ball h-11 w-11 bg-white text-slate-500">A</div>
                  <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300" />
                  <div className="science-ball h-11 w-11 bg-white text-slate-500">B</div>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{t('noBallTwice')}</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

function MachineCard({
  isAnimating,
  label,
  tone,
  values,
}: {
  isAnimating: boolean;
  label: string;
  tone: 'amber' | 'teal';
  values: number[];
}) {
  const palette =
    tone === 'teal'
      ? {
          badge: 'bg-teal-500 text-white',
          panel: 'from-teal-50/95 via-white to-cyan-50/85',
          rail: 'from-teal-400 via-cyan-400 to-teal-300',
        }
      : {
          badge: 'bg-amber-300 text-amber-950',
          panel: 'from-amber-50/95 via-white to-orange-50/85',
          rail: 'from-amber-300 via-orange-300 to-amber-200',
        };

  return (
    <div className={`rounded-[1.9rem] border border-white/80 bg-gradient-to-br ${palette.panel} px-4 py-5 shadow-[0_20px_32px_rgba(15,23,42,0.06)]`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xl font-bold text-slate-800">{label}</p>
        <div className={`science-ball h-11 w-11 ${palette.badge}`}>{values.length}</div>
      </div>

      <div className="mt-5 rounded-[1.8rem] border border-slate-200/80 bg-white/90 px-4 py-5">
        <div className={`h-2 rounded-full bg-gradient-to-r ${palette.rail}`} />

        <div className="mt-5 flex min-h-[112px] flex-wrap items-center justify-center gap-3">
          {isAnimating ? (
            <>
              {Array.from({ length: tone === 'teal' ? 5 : 2 }, (_, index) => (
                <motion.div
                  key={`${tone}-ghost-${index}`}
                  className={`science-ball h-12 w-12 ${tone === 'teal' ? 'bg-teal-200 text-teal-200' : 'bg-amber-200 text-amber-200'}`}
                  animate={{ y: [0, -8, 0], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 0.45, repeat: Infinity, delay: index * 0.08 }}
                >
                  •
                </motion.div>
              ))}
            </>
          ) : (
            <AnimatePresence>
              {values.length > 0 ? (
                values.map((value, index) =>
                  tone === 'teal' ? (
                    <motion.div
                      key={`main-${value}`}
                      className="science-ball h-12 w-12 bg-gradient-to-br from-teal-400 to-teal-600 text-lg text-white"
                      initial={{ opacity: 0, y: -18, scale: 0.75 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      {value}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`star-${value}`}
                      className="relative flex h-14 w-14 items-center justify-center"
                      initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: index === 0 ? -8 : 8 }}
                      transition={{ delay: 0.12 + index * 0.08, type: 'spring', stiffness: 220, damping: 15 }}
                    >
                      <Star className="absolute h-full w-full fill-amber-300 text-amber-400 drop-shadow-[0_10px_18px_rgba(245,158,11,0.24)]" />
                      <span className="relative z-10 font-display text-lg font-extrabold text-amber-950">{value}</span>
                    </motion.div>
                  )
                )
              ) : (
                <p className="text-center text-sm font-semibold text-slate-400">{label}</p>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadoutRow({
  label,
  placeholder,
  tone,
  values,
}: {
  label: string;
  placeholder: string;
  tone: 'amber' | 'teal';
  values: number[];
}) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/80 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <span className={`text-sm font-extrabold ${tone === 'teal' ? 'text-teal-600' : 'text-amber-600'}`}>
          {values.length > 0 ? values.length : 0}
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-slate-800">
        {values.length > 0 ? values.join('  ') : placeholder}
      </p>
    </div>
  );
}
