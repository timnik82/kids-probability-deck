'use client';

import { TOTAL_SLIDES } from '@/lib/constants';

interface ProgressDotsProps {
  current: number;
  onDotClick: (index: number) => void;
}

export default function ProgressDots({ current, onDotClick }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Slide ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 h-3 bg-teal-500'
              : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
          }`}
        />
      ))}
    </div>
  );
}
