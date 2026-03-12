'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { CalendarDays, Equal, Shuffle, Sparkles, Star, Users } from 'lucide-react';
import { TOTAL_OUTCOMES } from '@/lib/probability';

interface Props {
  goTo: (n: number) => void;
}

const MODE_CARDS = {
  birthday: {
    mains: [4, 11, 19, 24, 31],
    stars: [2, 8],
    icon: CalendarDays,
    panelClass: 'from-amber-50/95 via-white to-orange-50/90',
    activeClass: 'border-amber-200 shadow-[0_18px_40px_rgba(245,158,11,0.16)]',
    ballClass: 'from-amber-300 to-orange-400 text-amber-950',
    badgeClass: 'bg-amber-100 text-amber-800',
  },
  random: {
    mains: [6, 18, 27, 42, 50],
    stars: [5, 11],
    icon: Shuffle,
    panelClass: 'from-teal-50/95 via-white to-cyan-50/90',
    activeClass: 'border-teal-200 shadow-[0_18px_40px_rgba(13,148,136,0.16)]',
    ballClass: 'from-teal-400 to-cyan-500 text-white',
    badgeClass: 'bg-teal-100 text-teal-700',
  },
} as const;

const SHARE_PATTERNS = {
  birthday: [7, 7, 12, 12, 19, 24, 24, 31],
  random: [3, 14, 22, 28, 35, 41, 47, 50],
} as const;

export default function Slide10Special({ goTo }: Props) {
  const t = useTranslations('slide10');
  const locale = useLocale();
  const [mode, setMode] = useState<'birthday' | 'random'>('birthday');
  void goTo;
  const numberFormatter = new Intl.NumberFormat(locale);

  const odds = `1 : ${numberFormatter.format(TOTAL_OUTCOMES)}`;

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-6xl space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {t('test')}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-500 sm:text-lg">
            {t('note')}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="science-panel overflow-visible px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-800">{t('title')}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{t('sameChance')}</p>
              </div>

              <div className="inline-flex rounded-[1.6rem] border border-slate-200/80 bg-white/80 p-1.5 shadow-[0_12px_26px_rgba(15,23,42,0.08)]">
                {(['birthday', 'random'] as const).map((variant) => {
                  const Icon = MODE_CARDS[variant].icon;
                  const active = mode === variant;

                  return (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setMode(variant)}
                      aria-pressed={active}
                      className={`inline-flex min-h-[52px] items-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-extrabold transition-all sm:px-5 ${
                        active
                          ? variant === 'birthday'
                            ? 'bg-amber-400 text-amber-950 shadow-lg shadow-amber-900/10'
                            : 'bg-teal-500 text-white shadow-lg shadow-teal-900/10'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t(variant)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(['birthday', 'random'] as const).map((variant, index) => {
                const config = MODE_CARDS[variant];
                const active = mode === variant;
                const Icon = config.icon;

                return (
                  <motion.article
                    key={variant}
                    className={`science-panel bg-gradient-to-br ${config.panelClass} px-5 py-5 transition-all ${
                      active ? config.activeClass : 'border-white/70 opacity-80'
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: active ? 1 : 0.88, y: 0, scale: active ? 1 : 0.985 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`science-ball h-11 w-11 ${
                            variant === 'birthday' ? 'bg-amber-300 text-amber-950' : 'bg-teal-500 text-white'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display text-xl font-bold text-slate-800">{t(variant)}</p>
                          <p className="text-sm font-semibold text-slate-500">{t('jackpotOdds')}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${config.badgeClass}`}>
                        {active ? t('test') : '...'}
                      </span>
                    </div>

                    <div className="mt-5 rounded-[1.8rem] border border-dashed border-slate-300/80 bg-white/80 px-4 py-4">
                      <div className="flex flex-wrap gap-2.5">
                        {config.mains.map((value) => (
                          <div
                            key={`${variant}-main-${value}`}
                            className={`science-ball h-12 w-12 bg-gradient-to-br text-base ${config.ballClass}`}
                          >
                            {value}
                          </div>
                        ))}
                      </div>

                      <div className="my-4 h-px bg-slate-200" />

                      <div className="flex flex-wrap gap-3">
                        {config.stars.map((value) => (
                          <div key={`${variant}-star-${value}`} className="relative flex h-12 w-12 items-center justify-center">
                            <Star className="absolute h-full w-full fill-amber-300 text-amber-400" />
                            <span className="relative z-10 font-display text-base font-extrabold text-amber-950">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 font-display text-2xl font-bold text-slate-800">{odds}</p>
                  </motion.article>
                );
              })}
            </div>

            <motion.div
              key={mode}
              className="mt-5 rounded-[1.9rem] border border-dashed border-slate-300/80 bg-white/70 px-4 py-5 sm:px-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  {MODE_CARDS.birthday.mains.slice(0, 2).map((value) => (
                    <div key={`eq-b-${value}`} className="science-ball h-10 w-10 bg-white text-slate-500">
                      {value}
                    </div>
                  ))}
                </div>
                <div className="science-ball h-11 w-11 bg-teal-500 text-white">
                  <Equal className="h-5 w-5" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {MODE_CARDS.random.mains.slice(0, 2).map((value) => (
                    <div key={`eq-r-${value}`} className="science-ball h-10 w-10 bg-white text-slate-500">
                      {value}
                    </div>
                  ))}
                </div>
                <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-amber-300 via-cyan-400 to-teal-500" />
                <p className="font-display text-2xl font-extrabold text-slate-800">{odds}</p>
              </div>
            </motion.div>
          </section>

          <aside className="space-y-5">
            <motion.section
              className="science-panel overflow-visible bg-gradient-to-br from-teal-600 via-cyan-500 to-teal-500 px-6 py-6 text-white sm:px-7"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="absolute inset-x-8 -top-4 h-12 rounded-full bg-white/25 blur-3xl" />
              <div className="relative">
                <div className="science-kicker w-fit border-white/20 bg-white/15 text-white">
                  {t('jackpotOdds')}
                </div>
                <p className="mt-5 font-display text-4xl font-extrabold leading-none sm:text-5xl">{odds}</p>
                <p className="mt-4 max-w-sm text-xl font-extrabold leading-tight text-white">{t('sameChance')}</p>
                <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-teal-50 sm:text-base">{t('note')}</p>
              </div>
            </motion.section>

            <motion.section
              key={`share-${mode}`}
              className="science-panel bg-amber-50/85 px-5 py-5 sm:px-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="science-ball h-11 w-11 bg-amber-300 text-amber-950">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-800">{t(mode)}</p>
                  <p className="text-sm font-semibold text-slate-500">{t('shareNote')}</p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.8rem] border border-dashed border-amber-200/80 bg-white/75 px-4 py-4">
                <div className={`grid gap-2 ${mode === 'birthday' ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-5'}`}>
                  {SHARE_PATTERNS[mode].map((value, index) => (
                    <motion.div
                      key={`${mode}-${value}-${index}`}
                      className={`science-ball h-11 w-11 ${
                        mode === 'birthday'
                          ? 'bg-gradient-to-br from-amber-200 to-orange-300 text-amber-950'
                          : 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </aside>
        </div>
      </div>
    </div>
  );
}
