'use client';

import { TOTAL_SLIDES } from '@/lib/constants';

interface ProgressDotsProps {
  current: number;
  onDotClick: (index: number) => void;
}

export default function ProgressDots({ current, onDotClick }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap">
      {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Slide ${i + 1}`}
          aria-current={i === current ? 'step' : undefined}
          className={`science-ball h-9 text-sm transition-all duration-300 ${
            i === current
              ? 'w-12 border-teal-200 bg-teal-500 text-white'
              : 'w-9 bg-white/88 text-slate-500 hover:-translate-y-0.5 hover:border-teal-100 hover:text-teal-700'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
