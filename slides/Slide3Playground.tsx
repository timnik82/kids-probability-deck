'use client';

import { type ReactNode, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Coins, Dice5, RefreshCw, Sparkles, Waves } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

type Tab = 'coin' | 'die' | 'bag';

export default function Slide3Playground({ goTo }: Props) {
  const t = useTranslations('slide3');
  const [tab, setTab] = useState<Tab>('coin');

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-5xl space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {t('formula')}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl">{t('title')}</h1>
        </div>

        <div className="science-panel p-3 sm:p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              { id: 'coin', icon: Coins },
              { id: 'die', icon: Dice5 },
              { id: 'bag', icon: Waves },
            ] as const).map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-[1.6rem] border px-4 py-4 text-left transition-all ${
                  tab === id
                    ? 'border-teal-200 bg-teal-500 text-white shadow-lg shadow-teal-900/15'
                    : 'border-white/80 bg-white/[0.85] text-slate-700 hover:border-teal-100 hover:bg-teal-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`science-ball h-12 w-12 ${tab === id ? 'bg-white/20 text-white' : 'bg-slate-50 text-teal-700'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-xl font-bold">{t(id)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="science-panel p-5 sm:p-7">
          {tab === 'coin' && <CoinTab />}
          {tab === 'die' && <DieTab />}
          {tab === 'bag' && <BagTab />}
        </div>
      </div>
    </div>
  );
}

function CoinTab() {
  const t = useTranslations('slide3');
  const resetLabel = t('reset');
  const [results, setResults] = useState<boolean[]>([]);

  const flip = useCallback(() => {
    setResults((prev) => [...prev, Math.random() < 0.5]);
  }, []);

  const flipMany = useCallback((n: number) => {
    const batch: boolean[] = [];
    for (let i = 0; i < n; i++) batch.push(Math.random() < 0.5);
    setResults((prev) => [...prev, ...batch]);
  }, []);

  const heads = results.filter(Boolean).length;
  const total = results.length;
  const lastResult = total === 0 ? null : results[total - 1];
  const ratio = total > 0 ? heads / total : 0;
  const fractionLabel = total > 0 ? `${heads}/${total}` : '--';
  const ratioLabel = total > 0 ? ratio.toFixed(3) : '--';

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="science-panel bg-gradient-to-br from-teal-50/90 to-white px-5 py-6">
          <p className="science-kicker w-fit">{t('coin')}</p>
          <div className="mt-5 flex flex-col items-center gap-4 text-center">
            <motion.div
              key={total}
              className={`science-ball h-28 w-28 text-4xl ${
                lastResult === null
                  ? 'bg-white text-slate-400'
                  : lastResult
                    ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white'
                    : 'bg-gradient-to-br from-amber-300 to-orange-400 text-white'
              }`}
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 0.45 }}
            >
              {lastResult === null ? '?' : lastResult ? 'O' : 'X'}
            </motion.div>
            <p className="font-display text-2xl font-bold text-slate-800">{fractionLabel}</p>
            <p className="text-sm font-semibold text-slate-500">{t('probability')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <DataCard label={t('heads')} value={heads} tone="teal" />
            <DataCard label={t('tails')} value={total - heads} tone="amber" />
            <DataCard label={t('total')} value={total} tone="slate" />
          </div>

          <div className="science-panel px-5 py-5">
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-slate-500">
              <span>{t('probability')}</span>
              <span>{ratioLabel}</span>
            </div>
            <div className="mt-3 h-5 overflow-hidden rounded-full bg-slate-200/80">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                animate={{ width: `${ratio * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-500">{t('heads')} / {t('total')} = {ratioLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <ActionButton onClick={flip} tone="primary">
          {t('flip')} x1
        </ActionButton>
        <ActionButton onClick={() => flipMany(10)}>x10</ActionButton>
        <ActionButton onClick={() => flipMany(100)}>x100</ActionButton>
        <IconButton onClick={() => setResults([])} label={resetLabel} />
      </div>
    </div>
  );
}

function DieTab() {
  const t = useTranslations('slide3');
  const resetLabel = t('reset');
  const [target, setTarget] = useState<'even' | 'moreThan3' | 'exactly1'>('even');
  const [results, setResults] = useState<number[]>([]);

  const targetSets: Record<'even' | 'moreThan3' | 'exactly1', number[]> = {
    even: [2, 4, 6],
    moreThan3: [4, 5, 6],
    exactly1: [1],
  };

  const roll = useCallback(() => {
    setResults((prev) => [...prev, Math.floor(Math.random() * 6) + 1]);
  }, []);

  const rollMany = useCallback((n: number) => {
    const batch: number[] = [];
    for (let i = 0; i < n; i++) batch.push(Math.floor(Math.random() * 6) + 1);
    setResults((prev) => [...prev, ...batch]);
  }, []);

  const favorable = results.filter((r) => targetSets[target].includes(r)).length;
  const total = results.length;
  const lastRoll = results[results.length - 1];
  const ratio = total > 0 ? favorable / total : 0;
  const fractionLabel = total > 0 ? `${favorable}/${total}` : '--';
  const ratioLabel = total > 0 ? ratio.toFixed(3) : '--';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-3">
        {(['even', 'moreThan3', 'exactly1'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setTarget(opt);
              setResults([]);
            }}
            className={`rounded-full border px-4 py-2.5 text-sm font-extrabold transition-all ${
              target === opt
                ? 'border-teal-200 bg-teal-500 text-white shadow-lg shadow-teal-900/15'
                : 'border-white/80 bg-white text-slate-600 hover:border-teal-100 hover:bg-teal-50'
            }`}
          >
            {t(opt)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="science-panel bg-gradient-to-br from-amber-50/85 to-white px-5 py-6">
          <p className="science-kicker w-fit">{t('die')}</p>
          <div className="mt-5 flex flex-col items-center gap-4 text-center">
            <motion.div
              key={total}
              className="science-ball h-28 w-28 rounded-[2rem] bg-white text-5xl text-slate-700"
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 0.35 }}
            >
              {lastRoll || '?'}
            </motion.div>
            <p className="text-sm font-semibold text-slate-500">{t(target)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <DataCard label={t('favorable')} value={favorable} tone="teal" />
            <DataCard label={t('total')} value={total} tone="slate" />
            <DataCard label={t('probability')} value={ratioLabel} tone="amber" />
          </div>

          <div className="science-panel px-5 py-5">
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-slate-500">
              <span>{t('probability')}</span>
              <span>
                {targetSets[target].length}/6
              </span>
            </div>
            <div className="mt-3 h-5 overflow-hidden rounded-full bg-slate-200/80">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300"
                animate={{ width: `${ratio * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-500">{fractionLabel} = {ratioLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <ActionButton onClick={roll} tone="primary">
          {t('roll')} x1
        </ActionButton>
        <ActionButton onClick={() => rollMany(10)}>x10</ActionButton>
        <ActionButton onClick={() => rollMany(100)}>x100</ActionButton>
        <IconButton onClick={() => setResults([])} label={resetLabel} />
      </div>
    </div>
  );
}

function BagTab() {
  const t = useTranslations('slide3');
  const [totalBalls, setTotalBalls] = useState(10);
  const [redBalls, setRedBalls] = useState(3);

  const prob = totalBalls > 0 ? redBalls / totalBalls : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="space-y-4">
          <div className="science-panel px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <label className="font-display text-xl font-bold text-slate-800" htmlFor="total-balls">
                {t('totalBalls')}
              </label>
              <span className="science-kicker">{totalBalls}</span>
            </div>
            <input
              id="total-balls"
              type="range"
              min={1}
              max={20}
              value={totalBalls}
              onChange={(e) => {
                const v = Number(e.target.value);
                setTotalBalls(v);
                if (redBalls > v) setRedBalls(v);
              }}
              className="science-range mt-4"
            />
          </div>

          <div className="science-panel px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <label className="font-display text-xl font-bold text-slate-800" htmlFor="red-balls">
                {t('redBalls')}
              </label>
              <span className="science-kicker">{redBalls}</span>
            </div>
            <input
              id="red-balls"
              type="range"
              min={0}
              max={totalBalls}
              value={redBalls}
              onChange={(e) => setRedBalls(Number(e.target.value))}
              className="science-range mt-4"
            />
          </div>
        </div>

        <div className="science-panel bg-gradient-to-br from-sky-50/90 to-white px-5 py-6">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {Array.from({ length: totalBalls }, (_, i) => (
              <motion.div
                key={i}
                layout
                className={`science-ball aspect-square ${
                  i < redBalls
                    ? 'bg-gradient-to-br from-rose-400 to-orange-400 text-white'
                    : 'bg-gradient-to-br from-sky-300 to-cyan-400 text-white'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.02, type: 'spring', stiffness: 220, damping: 16 }}
              >
                {i < redBalls ? t('red').slice(0, 1).toUpperCase() : t('blue').slice(0, 1).toUpperCase()}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-slate-500">
              <span>{t('probability')}</span>
              <span>{prob.toFixed(3)}</span>
            </div>
            <div className="h-5 overflow-hidden rounded-full bg-slate-200/80">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 via-orange-300 to-amber-300"
                animate={{ width: `${prob * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {redBalls} / {totalBalls} = {prob.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: 'teal' | 'amber' | 'slate';
}) {
  const tones = {
    teal: 'from-teal-100 to-white text-teal-800',
    amber: 'from-amber-100 to-white text-amber-900',
    slate: 'from-slate-100 to-white text-slate-800',
  };

  return (
    <div className={`science-panel bg-gradient-to-br px-4 py-4 ${tones[tone]}`}>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  tone = 'secondary',
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: 'primary' | 'secondary';
}) {
  return (
    <button
      onClick={onClick}
      className={tone === 'primary' ? 'science-button-primary min-h-[54px]' : 'science-button-secondary min-h-[54px]'}
    >
      {children}
    </button>
  );
}

function IconButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="science-button-secondary min-h-[54px] px-4" aria-label={label}>
      <RefreshCw className="h-5 w-5" />
    </button>
  );
}
