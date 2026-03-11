'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowLeftRight, Eye, EyeOff, Sparkles } from 'lucide-react';
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
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-6xl space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            C(5,2)
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-600">{t('desc')}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="science-panel px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-800">{t('pickTwo')}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{t('desc')}</p>
              </div>
              <div className="science-kicker">{picked.length} / 2</div>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((n) => {
                const selected = picked.includes(n);
                const locked = picked.length >= 2 && !selected;

                return (
                  <button
                    key={n}
                    onClick={() => toggle(n)}
                    disabled={locked}
                    aria-pressed={selected}
                    className={`science-ball aspect-square text-xl transition-all sm:text-2xl ${
                      selected
                        ? 'border-teal-200 bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-900/15'
                        : 'bg-white text-slate-700 hover:-translate-y-0.5 hover:border-teal-100 hover:text-teal-700'
                    } ${locked ? 'cursor-not-allowed opacity-35 hover:translate-y-0 hover:text-slate-700' : ''}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-dashed border-slate-300/80 bg-white/[0.78] px-4 py-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{t('yourPick')}</p>

              {picked.length === 2 ? (
                <motion.div
                  className="mt-4 space-y-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <PairCard title={t('yourPick')} values={picked} tone="slate" />
                    <div className="science-ball mx-auto h-12 w-12 bg-white text-teal-700">
                      <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <PairCard title={t('sortedPick')} values={pickedSorted} tone="teal" />
                  </div>

                  <div className="rounded-[1.4rem] bg-teal-50 px-4 py-3 text-center">
                    <p className="font-display text-2xl font-bold text-slate-800">
                      {picked[0]}-{picked[1]} = {pickedSorted[0]}-{pickedSorted[1]}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-teal-700">{t('sameTicket')}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <PairCard title={t('yourPick')} values={picked} tone="slate" />
                  <PairCard title={t('sortedPick')} values={pickedSorted} tone="teal" />
                </div>
              )}
            </div>
          </section>

          <aside className="science-panel px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-800">{t('allPairs')}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{t('mathExplain')}</p>
              </div>
              <button
                onClick={() => setShowMath(!showMath)}
                className="science-button-secondary min-h-[52px] px-5 text-sm"
              >
                {showMath ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {t('showMath')}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {allPairs.map((pair, index) => (
                <motion.div
                  key={pair.join('-')}
                  className={`rounded-[1.4rem] border px-3 py-4 text-center transition-all ${
                    isMatch(pair)
                      ? 'border-teal-200 bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-900/15'
                      : 'border-white/80 bg-white/[0.86] text-slate-600'
                  }`}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: isMatch(pair) ? 1.03 : 1 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <p className="font-display text-2xl font-bold">{pair[0]}-{pair[1]}</p>
                </motion.div>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {showMath && (
                <motion.div
                  className="mt-5 rounded-[1.6rem] bg-slate-900 px-5 py-4 font-mono text-sm text-teal-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <p>{t('mathExplain')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PairCard({
  title,
  tone,
  values,
}: {
  title: string;
  tone: 'slate' | 'teal';
  values: number[];
}) {
  const display = values.length === 2 ? values : [null, null];

  return (
    <div className={`rounded-[1.5rem] border px-4 py-4 ${tone === 'teal' ? 'border-teal-100 bg-teal-50/80' : 'border-slate-200/80 bg-slate-50/80'}`}>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{title}</p>
      <div className="mt-3 flex items-center gap-3">
        {display.map((value, index) => (
          <div
            key={`${title}-${index}`}
            className={`science-ball h-12 w-12 ${value !== null && tone === 'teal' ? 'bg-teal-500 text-white' : 'bg-white text-slate-400'}`}
          >
            {value ?? '?'}
          </div>
        ))}
      </div>
    </div>
  );
}
