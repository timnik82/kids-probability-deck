'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { AlertTriangle, BookOpen, Hash, Sparkles, Star, Target, Trophy } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

export default function Slide12Wrapup({ goTo }: Props) {
  const t = useTranslations('slide12');
  void goTo;

  const points = [
    { icon: <BookOpen className="h-5 w-5" />, text: t('point1'), tone: 'text-teal-700 bg-teal-100' },
    { icon: <Star className="h-5 w-5 fill-current" />, text: t('point2'), tone: 'text-amber-700 bg-amber-100' },
    { icon: <Hash className="h-5 w-5" />, text: t('point3'), tone: 'text-sky-700 bg-sky-100' },
    { icon: <Target className="h-5 w-5" />, text: t('point4'), tone: 'text-rose-700 bg-rose-100' },
  ];

  return (
    <div className="deck-page-shell">
      <div className="w-full max-w-[1100px] space-y-4 sm:space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            139 838 160
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold text-slate-800 sm:text-[2.6rem]">{t('title')}</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.94fr_1.06fr]">
          <motion.section
            className="science-panel overflow-visible bg-gradient-to-br from-teal-600 via-cyan-500 to-amber-300 px-5 py-6 text-white sm:px-6 sm:py-7"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div className="absolute inset-x-10 top-6 h-16 rounded-full bg-white/25 blur-3xl" />

            <div className="relative">
              <div className="science-kicker w-fit border-white/20 bg-white/15 text-white">
                <Trophy className="h-3.5 w-3.5" />
                {t('learned')}
              </div>

              <p className="mt-4 font-display text-[2.4rem] font-extrabold leading-none text-white sm:text-[3rem]">{t('thanks')}</p>
              <p className="mt-3 max-w-md text-base font-semibold leading-7 text-teal-50 sm:text-[1.05rem]">{t('title')}</p>

              <div className="mt-5 rounded-[1.7rem] border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-white/80">5 + 2</p>
                    <p className="mt-2 font-display text-xl font-bold text-white">{t('ticketLabel')}</p>
                  </div>
                  <div className="science-ball h-14 w-14 bg-white text-amber-500">
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {[7, 12, 18, 29, 44].map((value) => (
                    <div
                      key={`wrap-main-${value}`}
                      className="science-ball h-10 w-10 bg-gradient-to-br from-white to-teal-50 text-sm text-teal-700"
                    >
                      {value}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {[3, 9].map((value) => (
                    <div key={`wrap-star-${value}`} className="relative flex h-10 w-10 items-center justify-center">
                      <Star className="absolute h-full w-full fill-amber-200 text-amber-100" />
                      <span className="relative z-10 font-display text-base font-extrabold text-amber-950">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <div className="space-y-4">
            <motion.section
              className="science-panel px-4 py-4 sm:px-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <p className="science-kicker w-fit">{t('learned')}</p>

              <div className="mt-4 space-y-3">
                {points.map((point, index) => (
                  <motion.div
                    key={point.text}
                    className="rounded-[1.45rem] border border-slate-200/80 bg-white/80 px-4 py-4"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + index * 0.08 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`science-ball h-10 w-10 shrink-0 ${point.tone}`}>{point.icon}</div>
                      <p className="pt-1 text-base font-semibold leading-7 text-slate-700 sm:text-lg">{point.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="science-panel bg-amber-50/90 px-4 py-4 sm:px-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <div className="flex items-start gap-3">
                <div className="science-ball h-10 w-10 shrink-0 bg-amber-300 text-amber-950">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <p className="pt-1 text-base font-bold leading-7 text-amber-900 sm:text-lg">{t('adultNote')}</p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
