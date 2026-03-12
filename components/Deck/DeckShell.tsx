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
        <div className="absolute left-[-4%] top-[8%] h-40 w-40 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute right-[-3%] top-[18%] h-32 w-32 rounded-full bg-amber-200/38 blur-3xl" />
        <div className="absolute bottom-[13%] left-[12%] h-24 w-24 rounded-full bg-cyan-200/34 blur-2xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-3 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-4">
        <header className="science-panel mb-2 shrink-0 px-4 py-2.5 sm:mb-3 sm:px-5 sm:py-3">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="science-ball h-10 w-10 bg-teal-500 text-white">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div>
                <div className="science-kicker w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  {Math.round(progress)}%
                </div>
                <p className="mt-1.5 font-display text-lg font-bold text-slate-800 sm:text-xl">
                  {current + 1} {t('of')} {TOTAL_SLIDES}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden min-w-[156px] md:block">
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
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
          <div className="mx-auto flex min-h-full w-full max-w-[1100px]">
            {children(current, goTo)}
          </div>
        </main>

        <footer className="science-panel mt-2 shrink-0 px-4 py-3 sm:mt-3 sm:px-5 sm:py-3.5">
          <div className="mx-auto max-w-[1100px] space-y-3">
            <ProgressDots current={current} onDotClick={goTo} />
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={prev}
                disabled={current === 0}
                className="science-button-secondary min-h-[52px] min-w-[118px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
                {t('back')}
              </button>
              <button
                onClick={next}
                disabled={current === TOTAL_SLIDES - 1}
                className="science-button-primary min-h-[52px] min-w-[118px] disabled:cursor-not-allowed disabled:opacity-40"
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
