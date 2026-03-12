'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, EyeOff, Sparkles, Star } from 'lucide-react';
import { comb, MAIN_COUNT, MAIN_PICK, STAR_COUNT, STAR_PICK, TOTAL_OUTCOMES } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide6HowMany({ goTo }: Props) {
  const t = useTranslations('slide6');
  const locale = useLocale();
  const [showMath, setShowMath] = useState(false);

  const waysMain = comb(MAIN_COUNT, MAIN_PICK);
  const waysStar = comb(STAR_COUNT, STAR_PICK);
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div className="deck-page-shell">
      <div className="w-full max-w-[1100px] space-y-4 sm:space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles aria-hidden="true" focusable={false} className="h-3.5 w-3.5" />
            {t('multiply')}
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold text-slate-800 sm:text-[2.6rem]">{t('title')}</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="space-y-4">
            <RevealCard
              delay={0.08}
              label={t('waysNumbers')}
              value={numberFormatter.format(waysMain)}
              tone="teal"
            >
              <div className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
                {Array.from({ length: MAIN_PICK }, (_, index) => (
                  <div
                    key={`main-ball-${index}`}
                    className="science-ball h-11 w-11 bg-gradient-to-br from-teal-400 to-teal-600 text-base text-white"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </RevealCard>

            <motion.div
              aria-hidden="true"
              className="science-kicker mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
            >
              ×
            </motion.div>

            <RevealCard
              delay={0.28}
              label={t('waysStars')}
              value={numberFormatter.format(waysStar)}
              tone="amber"
            >
              <div className="mt-4 flex flex-wrap gap-3" aria-hidden="true">
                {Array.from({ length: STAR_PICK }, (_, index) => (
                  <div key={`star-ball-${index}`} className="relative flex h-12 w-12 items-center justify-center">
                    <Star aria-hidden="true" focusable={false} className="absolute h-full w-full fill-amber-300 text-amber-400" />
                    <span className="relative z-10 font-display text-base font-extrabold text-amber-950">{index + 1}</span>
                  </div>
                ))}
              </div>
            </RevealCard>

            <motion.div
              aria-hidden="true"
              className="science-kicker mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
            >
              =
            </motion.div>

            <motion.div
              className="science-panel overflow-visible bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 px-5 py-5 sm:px-6"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.48, type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="absolute inset-x-8 -top-3 h-10 rounded-full bg-white/30 blur-2xl" />
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-100">{t('total')}</p>
              <p className="mt-3 font-display text-[2.8rem] font-extrabold leading-none text-white sm:text-[3.6rem]">
                {numberFormatter.format(TOTAL_OUTCOMES)}
              </p>
              <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-teal-50">{t('totalSimple')}</p>
            </motion.div>
          </section>

          <aside className="science-panel overflow-visible px-4 py-4 sm:px-5 sm:py-5">
            <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-teal-200/38 blur-3xl" />
            <div className="absolute right-8 top-10 h-20 w-20 rounded-full bg-amber-200/38 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-slate-800">{t('multiply')}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{t('mathTotal')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMath(!showMath)}
                  className="science-button-secondary min-h-[50px] px-4 text-sm"
                  aria-controls="slide6-math"
                  aria-expanded={showMath}
                  aria-label={showMath ? t('hideMath') : t('showMath')}
                >
                  {showMath ? (
                    <EyeOff aria-hidden="true" focusable={false} className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" focusable={false} className="h-4 w-4" />
                  )}
                  {showMath ? t('hideMath') : t('showMath')}
                </button>
              </div>

              <div className="mt-5 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-white/[0.8] px-4 py-4">
                <div className="grid gap-4">
                  <EquationRow label={`C(${MAIN_COUNT},${MAIN_PICK})`} value={numberFormatter.format(waysMain)} tone="teal" />
                  <EquationRow label={`C(${STAR_COUNT},${STAR_PICK})`} value={numberFormatter.format(waysStar)} tone="amber" />
                  <EquationRow label={t('total')} value={numberFormatter.format(TOTAL_OUTCOMES)} tone="slate" />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {showMath && (
                  <motion.div
                    id="slide6-math"
                    className="mt-4 rounded-[1.45rem] bg-slate-900 px-4 py-4 font-mono text-sm text-teal-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <p>{t('mathC50')}</p>
                    <p>{t('mathC12')}</p>
                    <p className="mt-2 text-amber-300">{t('mathTotal')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function RevealCard({
  children,
  delay,
  label,
  tone,
  value,
}: {
  children: ReactNode;
  delay: number;
  label: string;
  tone: 'amber' | 'teal';
  value: string;
}) {
  const palette =
    tone === 'teal'
      ? 'from-teal-50/95 via-white to-cyan-50/80 text-teal-600'
      : 'from-amber-50/95 via-white to-orange-50/80 text-amber-500';

  return (
    <motion.div
      className={`science-panel bg-gradient-to-br ${palette} px-5 py-5`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 font-display text-[2.6rem] font-extrabold leading-none sm:text-5xl">{value}</p>
      {children}
    </motion.div>
  );
}

function EquationRow({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'amber' | 'slate' | 'teal';
  value: string;
}) {
  const toneClass =
    tone === 'teal'
      ? 'text-teal-600'
      : tone === 'amber'
        ? 'text-amber-600'
        : 'text-slate-700';

  return (
    <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className={`font-display text-xl font-bold ${toneClass} sm:text-2xl`}>{value}</p>
      </div>
    </div>
  );
}
