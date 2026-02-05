'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

interface Question {
  key: string;
  options: string[];
  correctKey: string;
}

export default function Slide11Quiz({ goTo }: Props) {
  const t = useTranslations('slide11');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const questions: Question[] = useMemo(
    () => [
      { key: 'q1', options: ['q1a', 'q1b', 'q1c', 'q1d'], correctKey: t('q1correct') },
      { key: 'q2', options: ['q2a', 'q2b', 'q2c', 'q2d'], correctKey: t('q2correct') },
      { key: 'q3', options: ['q3a', 'q3b', 'q3c', 'q3d'], correctKey: t('q3correct') },
      { key: 'q4', options: ['q4a', 'q4b', 'q4c', 'q4d'], correctKey: t('q4correct') },
      { key: 'q5', options: ['q5a', 'q5b', 'q5c', 'q5d'], correctKey: t('q5correct') },
    ],
    [t]
  );

  const q = questions[currentQ];

  const handleSelect = useCallback(
    (optKey: string) => {
      if (showResult) return;
      setSelected(optKey);
      setShowResult(true);
      if (optKey === q.correctKey) {
        setScore((s) => s + 1);
      }
    },
    [showResult, q]
  );

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  }, [currentQ, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  }, []);

  if (finished) {
    const pct = score / questions.length;
    return (
      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto py-8 w-full">
        <h1 className="text-3xl font-extrabold text-slate-800">{t('finish')}</h1>
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <p className="text-5xl font-extrabold text-teal-600">
          {score} / {questions.length}
        </p>
        <p className="text-lg font-bold text-slate-600">
          {pct === 1 ? t('perfect') : pct >= 0.6 ? t('good') : t('tryAgain')}
        </p>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold
            hover:bg-teal-700 active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          {t('restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 max-w-lg mx-auto py-6 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">{t('title')}</h1>

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-400">
          {currentQ + 1} / {questions.length}
        </span>
        <span className="text-sm font-bold text-teal-600">
          {t('score')}: {score}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="w-full space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
        >
          <div className="rounded-2xl bg-white shadow-lg p-5">
            <p className="text-lg font-bold text-slate-800 mb-4">{t(q.key)}</p>
            <div className="space-y-2">
              {q.options.map((optKey) => {
                const isCorrect = optKey === q.correctKey;
                const isSelected = optKey === selected;
                let bgClass = 'bg-slate-50 border-2 border-slate-200 hover:border-teal-300';
                if (showResult && isCorrect) {
                  bgClass = 'bg-emerald-50 border-2 border-emerald-400';
                } else if (showResult && isSelected && !isCorrect) {
                  bgClass = 'bg-rose-50 border-2 border-rose-400';
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelect(optKey)}
                    disabled={showResult}
                    className={`w-full text-left px-5 py-3 rounded-xl font-bold text-base transition-all
                      active:scale-[0.98] ${bgClass} ${showResult ? 'cursor-default' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">{t(optKey)}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
          <p className={`text-lg font-bold ${selected === q.correctKey ? 'text-emerald-600' : 'text-rose-600'}`}>
            {selected === q.correctKey ? t('correct') : `${t('wrong')} ${t(q.correctKey)}`}
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl bg-teal-600 text-white font-bold text-lg
              hover:bg-teal-700 active:scale-95 transition-all"
          >
            {currentQ < questions.length - 1 ? t('nextQ') : t('finish')}
          </button>
        </motion.div>
      )}
    </div>
  );
}
