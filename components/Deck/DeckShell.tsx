'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, FlaskConical, Sparkles } from 'lucide-react';
import { TOTAL_SLIDES, SLIDE_PARAM } from '@/lib/constants';
import LanguageSwitcher from './LanguageSwitcher';
import ProgressDots from './ProgressDots';

export default function DeckShell({ children }: { children: (slide: number, goTo: (n: number) => void) => ReactNode }) {
  const t = useTranslations('nav');
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSlide = Math.min(
    Math.max(parseInt(searchParams.get(SLIDE_PARAM) || '0', 10) || 0, 0),
    TOTAL_SLIDES - 1
  );
  const [current, setCurrent] = useState(initialSlide);
  const progress = ((current + 1) / TOTAL_SLIDES) * 100;

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(n, 0), TOTAL_SLIDES - 1);
      setCurrent(clamped);
      const params = new URLSearchParams(searchParams.toString());
      params.set(SLIDE_PARAM, String(clamped));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-[8%] h-48 w-48 rounded-full bg-teal-200/35 blur-3xl" />
        <div className="absolute right-[-4%] top-[18%] h-40 w-40 rounded-full bg-amber-200/45 blur-3xl" />
        <div className="absolute bottom-[12%] left-[12%] h-28 w-28 rounded-full bg-cyan-200/40 blur-2xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-5">
        <header className="science-panel mb-3 shrink-0 px-4 py-3 sm:mb-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="science-ball h-12 w-12 bg-teal-500 text-white">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div>
                <div className="science-kicker w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  {Math.round(progress)}%
                </div>
                <p className="mt-2 font-display text-xl font-bold text-slate-800 sm:text-2xl">
                  {current + 1} {t('of')} {TOTAL_SLIDES}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden min-w-[180px] sm:block">
                <div className="h-3 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-amber-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-6xl">
            {children(current, goTo)}
          </div>
        </main>

        <footer className="science-panel mt-3 shrink-0 px-4 py-4 sm:mt-4 sm:px-6">
          <div className="space-y-4">
            <ProgressDots current={current} onDotClick={goTo} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={prev}
                disabled={current === 0}
                className="science-button-secondary min-h-[58px] min-w-[132px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
                {t('back')}
              </button>
              <button
                onClick={next}
                disabled={current === TOTAL_SLIDES - 1}
                className="science-button-primary min-h-[58px] min-w-[132px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('next')}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
