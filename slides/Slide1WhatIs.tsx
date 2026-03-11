'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, Star, Ticket } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

const sampleNumbers = [7, 14, 23, 38, 45];
const sampleStars = [3, 9];

export default function Slide1WhatIs({ goTo }: Props) {
  const t = useTranslations('slide1');

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="grid w-full max-w-6xl gap-5 lg:grid-cols-[1fr_1.05fr]">
        <section className="science-panel px-6 py-7 sm:px-8 sm:py-8">
          <motion.div
            className="science-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            5 + 2
          </motion.div>

          <motion.h1
            className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-tight text-slate-800 sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            {t('title')}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-600"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            {t('p1')}
          </motion.p>

          <div className="mt-7 space-y-4">
            <LessonCard
              delay={0.18}
              index="01"
              icon={
                <div className="flex gap-2">
                  {sampleNumbers.slice(0, 3).map((n) => (
                    <div
                      key={n}
                      className="science-ball h-9 w-9 bg-gradient-to-br from-teal-400 to-teal-600 text-sm text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              }
              title={t('numbers')}
              description={t('p2')}
              badge="5 / 50"
            />

            <LessonCard
              delay={0.26}
              index="02"
              icon={
                <div className="flex gap-2">
                  {sampleStars.map((n) => (
                    <div key={n} className="relative flex h-10 w-10 items-center justify-center">
                      <Star className="absolute h-full w-full fill-amber-300 text-amber-400" />
                      <span className="relative z-10 font-display text-sm font-extrabold text-amber-950">{n}</span>
                    </div>
                  ))}
                </div>
              }
              title={t('stars')}
              description={t('p3')}
              badge="2 / 12"
            />

            <LessonCard
              delay={0.34}
              index="03"
              icon={
                <div className="science-ball h-11 w-11 bg-white text-teal-700">
                  <Ticket className="h-5 w-5" />
                </div>
              }
              title={t('title')}
              description={t('p4')}
              badge="?"
            />
          </div>
        </section>

        <motion.aside
          className="science-panel overflow-visible px-5 py-6 sm:px-7 sm:py-7"
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.35 }}
        >
          <div className="absolute inset-x-10 top-9 h-24 rounded-full bg-gradient-to-r from-teal-200/50 via-cyan-100/10 to-amber-200/45 blur-3xl" />

          <div className="relative rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_22px_40px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="absolute -left-3 top-6 h-9 w-16 rotate-[-8deg] rounded-md bg-amber-200/85 shadow-sm" />
            <div className="absolute -right-2 top-10 h-9 w-14 rotate-[10deg] rounded-md bg-teal-200/75 shadow-sm" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="science-kicker">
                  <Sparkles className="h-3.5 w-3.5" />
                  5 + 2
                </div>
                <p className="mt-2 font-display text-2xl font-bold text-slate-800">{t('title')}</p>
              </div>
              <div className="science-kicker">5 / 50</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.8rem] border border-dashed border-slate-300/80 bg-white/[0.84] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl font-bold text-slate-800">{t('numbers')}</p>
                  <span className="science-kicker">5 / 50</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {sampleNumbers.map((n, index) => (
                    <motion.div
                      key={n}
                      className="science-ball h-14 w-14 bg-gradient-to-br from-teal-400 to-teal-600 text-xl text-white"
                      initial={{ opacity: 0, y: 16, rotate: -8 }}
                      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -4 : 4 }}
                      transition={{ delay: 0.18 + index * 0.05, type: 'spring', stiffness: 240, damping: 18 }}
                    >
                      {n}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-dashed border-slate-300/80 bg-amber-50/70 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl font-bold text-slate-800">{t('stars')}</p>
                  <span className="science-kicker">2 / 12</span>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 sm:justify-start">
                  {sampleStars.map((n, index) => (
                    <motion.div
                      key={n}
                      className="relative flex h-16 w-16 items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8, rotate: -24 }}
                      animate={{ opacity: 1, scale: 1, rotate: index === 0 ? -8 : 8 }}
                      transition={{ delay: 0.42 + index * 0.08, type: 'spring', stiffness: 210, damping: 14 }}
                    >
                      <Star className="absolute h-full w-full fill-amber-300 text-amber-400 drop-shadow-[0_10px_18px_rgba(245,158,11,0.22)]" />
                      <span className="relative z-10 font-display text-xl font-extrabold text-amber-950">{n}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.8rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="science-ball h-11 w-11 bg-white text-slate-500">1</div>
                <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400" />
                <div className="science-ball h-11 w-11 bg-white text-slate-500">2</div>
                <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-amber-300 to-orange-300" />
                <div className="science-ball h-11 w-11 bg-teal-500 text-white">?</div>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{t('p4')}</p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function LessonCard({
  badge,
  delay,
  description,
  icon,
  index,
  title,
}: {
  badge: string;
  delay: number;
  description: string;
  icon: ReactNode;
  index: string;
  title: string;
}) {
  return (
    <motion.div
      className="science-panel bg-white/70 px-4 py-4 sm:px-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="science-ball h-11 w-11 bg-slate-50 text-sm text-slate-500">{index}</div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-display text-xl font-bold text-slate-800">{title}</p>
              <span className="science-kicker">{badge}</span>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">{description}</p>
          </div>
        </div>
        <div className="shrink-0">{icon}</div>
      </div>
    </motion.div>
  );
}
