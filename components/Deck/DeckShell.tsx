'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-slate-50 to-teal-50 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 shrink-0 z-10">
        <span className="text-sm font-medium text-slate-500">
          {current + 1} {t('of')} {TOTAL_SLIDES}
        </span>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {children(current, goTo)}
      </main>

      <footer className="shrink-0 px-4 py-3 space-y-2 bg-white/60 backdrop-blur-sm border-t border-slate-200/50">
        <ProgressDots current={current} onDotClick={goTo} />
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-1 px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-lg
              disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-300 active:scale-95 transition-all min-w-[120px] justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('back')}
          </button>
          <button
            onClick={next}
            disabled={current === TOTAL_SLIDES - 1}
            className="flex items-center gap-1 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-lg
              disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-700 active:scale-95 transition-all min-w-[120px] justify-center"
          >
            {t('next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
