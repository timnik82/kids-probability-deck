'use client';

import { TOTAL_SLIDES } from '@/lib/constants';

interface ProgressDotsProps {
  current: number;
  onDotClick: (index: number) => void;
}

export default function ProgressDots({ current, onDotClick }: ProgressDotsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Slide ${i + 1}`}
          aria-current={i === current ? 'step' : undefined}
          className={`science-ball h-9 w-9 text-xs transition-all duration-300 sm:h-10 sm:w-10 sm:text-sm ${
            i === current
              ? 'border-teal-200 bg-teal-500 text-white sm:w-11'
              : 'bg-white/[0.88] text-slate-500 hover:-translate-y-0.5 hover:border-teal-100 hover:text-teal-700'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
