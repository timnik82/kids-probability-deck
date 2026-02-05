'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const slides = [
  dynamic(() => import('@/slides/Slide0Welcome')),
  dynamic(() => import('@/slides/Slide1WhatIs')),
  dynamic(() => import('@/slides/Slide2Draw')),
  dynamic(() => import('@/slides/Slide3Playground')),
  dynamic(() => import('@/slides/Slide4Combinations')),
  dynamic(() => import('@/slides/Slide5Ticket')),
  dynamic(() => import('@/slides/Slide6HowMany')),
  dynamic(() => import('@/slides/Slide7Jackpot')),
  dynamic(() => import('@/slides/Slide8Prizes')),
  dynamic(() => import('@/slides/Slide9Simulation')),
  dynamic(() => import('@/slides/Slide10Special')),
  dynamic(() => import('@/slides/Slide11Quiz')),
  dynamic(() => import('@/slides/Slide12Wrapup')),
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
        <SlideComponent goTo={goTo} />
      </motion.div>
    </AnimatePresence>
  );
}
