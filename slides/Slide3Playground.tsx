'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface Props {
  goTo: (n: number) => void;
}

type Tab = 'coin' | 'die' | 'bag';

export default function Slide3Playground({ goTo }: Props) {
  const t = useTranslations('slide3');
  const [tab, setTab] = useState<Tab>('coin');

  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto py-4 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      <div className="flex gap-2 bg-white rounded-xl p-1 shadow">
        {(['coin', 'die', 'bag'] as Tab[]).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2.5 rounded-lg font-bold text-base transition-all ${
              tab === id ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t(id)}
          </button>
        ))}
      </div>

      <div className="w-full rounded-2xl bg-white shadow-lg p-6">
        {tab === 'coin' && <CoinTab />}
        {tab === 'die' && <DieTab />}
        {tab === 'bag' && <BagTab />}
      </div>

      <p className="text-sm font-semibold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl text-center">
        {t('formula')}
      </p>
    </div>
  );
}

function CoinTab() {
  const t = useTranslations('slide3');
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <motion.div
          key={total}
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-slate-200"
          style={{ backgroundColor: total > 0 && results[total - 1] ? '#14b8a6' : '#f59e0b', color: 'white' }}
          animate={{ rotateY: [0, 180, 360] }}
          transition={{ duration: 0.4 }}
        >
          {total === 0 ? '?' : results[total - 1] ? 'O' : 'X'}
        </motion.div>
        <div className="text-left">
          <p className="text-sm text-slate-500">{t('heads')}: <span className="font-bold text-teal-700">{heads}</span></p>
          <p className="text-sm text-slate-500">{t('tails')}: <span className="font-bold text-amber-600">{total - heads}</span></p>
          <p className="text-sm text-slate-500">{t('total')}: <span className="font-bold">{total}</span></p>
        </div>
      </div>

      {total > 0 && (
        <div className="text-center">
          <p className="text-lg font-bold text-slate-700">
            {t('probability')}: {heads}/{total} = {total > 0 ? (heads / total).toFixed(3) : '—'}
          </p>
          <div className="w-full max-w-xs mx-auto h-4 bg-slate-200 rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-teal-500 rounded-full"
              animate={{ width: `${total > 0 ? (heads / total) * 100 : 0}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('heads')} / {t('total')} (1/2 = 0.500)
          </p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={flip} className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 active:scale-95 transition-all">
          {t('flip')} x1
        </button>
        <button onClick={() => flipMany(10)} className="px-5 py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 active:scale-95 transition-all">
          x10
        </button>
        <button onClick={() => flipMany(100)} className="px-5 py-3 rounded-xl bg-teal-400 text-white font-bold hover:bg-teal-500 active:scale-95 transition-all">
          x100
        </button>
        <button onClick={() => setResults([])} className="px-5 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 active:scale-95 transition-all">
          Reset
        </button>
      </div>
    </div>
  );
}

function DieTab() {
  const t = useTranslations('slide3');
  const [target, setTarget] = useState<'even' | 'moreThan3' | 'exactly1'>('even');
  const [results, setResults] = useState<number[]>([]);

  const targetSets: Record<string, number[]> = {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 flex-wrap justify-center">
        <p className="text-sm font-semibold text-slate-500 self-center mr-1">{t('target')}:</p>
        {(['even', 'moreThan3', 'exactly1'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => { setTarget(opt); setResults([]); }}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
              target === opt ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t(opt)}
          </button>
        ))}
      </div>

      <motion.div
        key={total}
        className="w-20 h-20 rounded-2xl bg-white border-4 border-slate-300 flex items-center justify-center text-4xl font-bold shadow-lg"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 0.3 }}
      >
        {lastRoll || '?'}
      </motion.div>

      {total > 0 && (
        <p className="text-lg font-bold text-slate-700">
          {t('favorable')}: {favorable}/{total} = {(favorable / total).toFixed(3)}
          <span className="text-sm text-slate-400 ml-2">
            ({targetSets[target].length}/6 = {(targetSets[target].length / 6).toFixed(3)})
          </span>
        </p>
      )}

      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={roll} className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 active:scale-95 transition-all">
          {t('roll')} x1
        </button>
        <button onClick={() => rollMany(10)} className="px-5 py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 active:scale-95 transition-all">
          x10
        </button>
        <button onClick={() => rollMany(100)} className="px-5 py-3 rounded-xl bg-teal-400 text-white font-bold hover:bg-teal-500 active:scale-95 transition-all">
          x100
        </button>
        <button onClick={() => setResults([])} className="px-5 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 active:scale-95 transition-all">
          Reset
        </button>
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
    <div className="flex flex-col items-center gap-5">
      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">
            {t('totalBalls')}: <span className="text-teal-700">{totalBalls}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={totalBalls}
            onChange={(e) => {
              const v = Number(e.target.value);
              setTotalBalls(v);
              if (redBalls > v) setRedBalls(v);
            }}
            className="w-full accent-teal-600 h-3 cursor-pointer"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">
            {t('redBalls')}: <span className="text-rose-600">{redBalls}</span>
          </label>
          <input
            type="range"
            min={0}
            max={totalBalls}
            value={redBalls}
            onChange={(e) => setRedBalls(Number(e.target.value))}
            className="w-full accent-rose-500 h-3 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {Array.from({ length: totalBalls }, (_, i) => (
          <motion.div
            key={i}
            layout
            className={`w-10 h-10 rounded-full shadow-sm ${
              i < redBalls ? 'bg-rose-500' : 'bg-sky-400'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03, type: 'spring' }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold text-slate-800">
          {redBalls} / {totalBalls} = {prob.toFixed(3)}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {t('probability')} ({t('red')})
        </p>
      </div>
    </div>
  );
}
