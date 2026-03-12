'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChevronRight, RotateCcw, Sparkles, Trophy, XCircle } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

interface Question {
  key: string;
  options: string[];
  correctKey: string;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function Slide11Quiz({ goTo }: Props) {
  const t = useTranslations('slide11');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);
  void goTo;

  const questions: Question[] = [
    { key: 'q1', options: ['q1a', 'q1b', 'q1c', 'q1d'], correctKey: t('q1correct') },
    { key: 'q2', options: ['q2a', 'q2b', 'q2c', 'q2d'], correctKey: t('q2correct') },
    { key: 'q3', options: ['q3a', 'q3b', 'q3c', 'q3d'], correctKey: t('q3correct') },
    { key: 'q4', options: ['q4a', 'q4b', 'q4c', 'q4d'], correctKey: t('q4correct') },
    { key: 'q5', options: ['q5a', 'q5b', 'q5c', 'q5d'], correctKey: t('q5correct') },
  ];

  const q = questions[currentQ];
  const correct = selected === q.correctKey;
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleSelect = (optKey: string) => {
    if (showResult) return;
    setSelected(optKey);
    setShowResult(true);
    const isCorrect = optKey === q.correctKey;
    setAnswerHistory((history) => [...history, isCorrect]);
    if (isCorrect) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((index) => index + 1);
      setSelected(null);
      setShowResult(false);
      return;
    }

    setFinished(true);
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setAnswerHistory([]);
  };

  const resultPanel = showResult ? (
    <motion.section
      key={`${currentQ}-${selected}`}
      className={`science-panel px-5 py-5 sm:px-6 ${
        correct ? 'bg-emerald-50/90' : 'bg-rose-50/90'
      }`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`science-ball h-12 w-12 shrink-0 ${
            correct ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}
        >
          {correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        </div>
        <div>
          <p className={`font-display text-2xl font-bold ${correct ? 'text-emerald-700' : 'text-rose-700'}`}>
            {correct ? t('correct') : t('wrong')}
          </p>
          {!correct && (
            <p className="mt-2 text-sm font-semibold leading-6 text-rose-700">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                {OPTION_LABELS[q.options.indexOf(q.correctKey)]}
              </span>
              {t(q.correctKey)}
            </p>
          )}
        </div>
      </div>

      <button type="button" onClick={handleNext} className="science-button-primary mt-5 min-h-[58px] w-full">
        {currentQ < questions.length - 1 ? t('nextQ') : t('finish')}
        <ChevronRight className="h-5 w-5" />
      </button>
    </motion.section>
  ) : null;

  if (finished) {
    const pct = score / questions.length;
    const summary = pct === 1 ? t('perfect') : pct >= 0.6 ? t('good') : t('tryAgain');

    return (
      <div className="flex w-full justify-center py-4 sm:py-6">
        <motion.div
          className="science-panel overflow-visible w-full max-w-4xl bg-gradient-to-br from-teal-600 via-cyan-500 to-amber-300 px-6 py-8 text-white sm:px-8 sm:py-9"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        >
          <div className="absolute inset-x-8 top-4 h-16 rounded-full bg-white/25 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="science-kicker w-fit border-white/20 bg-white/15 text-white">
                <Sparkles className="h-3.5 w-3.5" />
                {t('finish')}
              </div>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">
                {score} / {questions.length}
              </h1>
              <p className="mt-4 max-w-xl text-xl font-extrabold leading-tight text-white sm:text-2xl">{summary}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {Array.from({ length: questions.length }, (_, index) => (
                  <div
                    key={`finish-chip-${index}`}
                    className={`science-ball h-11 w-11 ${
                      answerHistory[index] ? 'bg-white text-teal-700' : 'bg-white/15 text-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/15 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-50">{t('score')}</p>
                  <p className="mt-2 font-display text-5xl font-extrabold leading-none text-white">{score}</p>
                </div>
                <div className="science-ball h-20 w-20 bg-white text-amber-500">
                  <Trophy className="h-10 w-10" />
                </div>
              </div>

              <button type="button" onClick={handleRestart} className="science-button-secondary mt-6 min-h-[58px] w-full bg-white text-slate-800">
                <RotateCcw className="h-5 w-5" />
                {t('restart')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center py-4 sm:py-6">
      <div className="w-full max-w-6xl space-y-5">
        <div className="text-center">
          <div className="science-kicker mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            {currentQ + 1} / {questions.length}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-800 sm:text-5xl">{t('title')}</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="science-panel overflow-visible px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-800">{t(q.key)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {t('score')}: {score}
                </p>
              </div>
              <div className="science-kicker">{currentQ + 1} / {questions.length}</div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-amber-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                className="mt-5 space-y-3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                {q.options.map((optKey, index) => {
                  const isCorrect = optKey === q.correctKey;
                  const isSelected = optKey === selected;

                  let optionClass = 'border-white/80 bg-white/80 hover:-translate-y-0.5 hover:border-teal-100 hover:bg-teal-50';
                  let badgeClass = 'bg-slate-100 text-slate-500';

                  if (showResult && isCorrect) {
                    optionClass = 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-[0_16px_30px_rgba(16,185,129,0.12)]';
                    badgeClass = 'bg-emerald-500 text-white';
                  } else if (showResult && isSelected && !isCorrect) {
                    optionClass = 'border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-[0_16px_30px_rgba(244,63,94,0.12)]';
                    badgeClass = 'bg-rose-500 text-white';
                  } else if (showResult) {
                    optionClass = 'border-slate-200/70 bg-slate-50/70 opacity-70';
                  }

                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelect(optKey)}
                      disabled={showResult}
                      className={`w-full rounded-[1.7rem] border px-4 py-4 text-left transition-all sm:px-5 sm:py-4 ${optionClass} ${
                        showResult ? 'cursor-default' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`science-ball h-11 w-11 shrink-0 ${badgeClass}`}>{OPTION_LABELS[index]}</div>
                        <div className="flex-1 pt-1">
                          <p className="text-base font-extrabold leading-7 text-slate-700 sm:text-lg">{t(optKey)}</p>
                        </div>
                        {showResult && isCorrect && <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="mt-1 h-6 w-6 shrink-0 text-rose-500" />}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5">
              <AnimatePresence mode="wait">{resultPanel}</AnimatePresence>
            </div>
          </section>

          <aside className="space-y-5">
            <motion.section
              className="science-panel bg-slate-900 px-5 py-5 text-white sm:px-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-200">{t('score')}</p>
                  <p className="mt-2 font-display text-5xl font-extrabold leading-none text-white">{score}</p>
                </div>
                <div className="science-ball h-16 w-16 bg-white text-slate-900">{currentQ + 1}</div>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {Array.from({ length: questions.length }, (_, index) => (
                  <div
                    key={`progress-${index}`}
                    className={`h-3 rounded-full transition-colors ${
                      index < currentQ ? 'bg-teal-400' : index === currentQ ? 'bg-amber-300' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </motion.section>
          </aside>
        </div>
      </div>
    </div>
  );
}
