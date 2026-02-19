'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';

const slides = [
  lazy(() => import('@/slides/Slide0Welcome')),
  lazy(() => import('@/slides/Slide1WhatIs')),
  lazy(() => import('@/slides/Slide2Draw')),
  lazy(() => import('@/slides/Slide3Playground')),
  lazy(() => import('@/slides/Slide4Combinations')),
  lazy(() => import('@/slides/Slide5Ticket')),
  lazy(() => import('@/slides/Slide6HowMany')),
  lazy(() => import('@/slides/Slide7Jackpot')),
  lazy(() => import('@/slides/Slide8Prizes')),
  lazy(() => import('@/slides/Slide9Simulation')),
  lazy(() => import('@/slides/Slide10Special')),
  lazy(() => import('@/slides/Slide11Quiz')),
  lazy(() => import('@/slides/Slide12Wrapup')),
];

interface SlideRendererProps {
  current: number;
  goTo: (n: number) => void;
}

export default function SlideRenderer({ current, goTo }: SlideRendererProps) {
  const SlideComponent = slides[current];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="h-full flex flex-col items-center"
      >
        <Suspense fallback={null}>
          <SlideComponent goTo={goTo} />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
