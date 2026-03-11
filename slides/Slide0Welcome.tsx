'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, Languages, Sparkles, Star } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

const demoMains = [7, 12, 18, 29, 44];
const demoStars = [3, 9];

export default function Slide0Welcome({ goTo }: Props) {
  const t = useTranslations('slide0');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchTo = (target: string) => {
    if (target !== locale) {
      const newPath = pathname.replace(`/${locale}`, `/${target}`);
      const params = new URLSearchParams(searchParams.toString());
      params.set('s', '0');
      router.push(`${newPath}?${params.toString()}`);
      localStorage.setItem('preferred-locale', target);
    }
  };

  return (
    <div className="flex w-full items-center justify-center py-4 sm:py-8">
      <div className="grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <section className="science-panel px-6 py-8 sm:px-8 sm:py-10">
          <motion.div
            className="science-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            5 + 2
          </motion.div>

          <motion.h1
            className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[0.95] text-slate-800 sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            {t('title')}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-lg text-lg font-semibold leading-8 text-slate-600 sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            className="mt-7 science-panel bg-amber-50/80 px-5 py-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex items-center gap-3">
              <div className="science-ball h-12 w-12 bg-amber-400 text-amber-950">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-slate-800">{t('pickLang')}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => switchTo('ru')}
                aria-pressed={locale === 'ru'}
                className={`flex-1 rounded-[1.5rem] border px-5 py-4 text-lg font-extrabold transition-all ${
                  locale === 'ru'
                    ? 'border-teal-200 bg-teal-500 text-white shadow-lg shadow-teal-900/15'
                    : 'border-white/80 bg-white text-slate-700 hover:border-teal-100 hover:bg-teal-50'
                }`}
              >
                Русский
              </button>
              <button
                onClick={() => switchTo('pt')}
                aria-pressed={locale === 'pt'}
                className={`flex-1 rounded-[1.5rem] border px-5 py-4 text-lg font-extrabold transition-all ${
                  locale === 'pt'
                    ? 'border-teal-200 bg-teal-500 text-white shadow-lg shadow-teal-900/15'
                    : 'border-white/80 bg-white text-slate-700 hover:border-teal-100 hover:bg-teal-50'
                }`}
              >
                Portugues
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button onClick={() => goTo(1)} className="science-button-primary min-h-[64px] px-8 text-lg sm:text-xl">
              {t('start')}
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="rounded-[1.4rem] border border-dashed border-slate-300/80 bg-white/65 px-5 py-4 text-sm font-bold text-slate-500">
              <span className="block font-display text-base text-slate-700">139 838 160</span>
              <span className="block">{t('subtitle')}</span>
            </div>
          </motion.div>
        </section>

        <motion.aside
          className="science-panel min-h-[420px] px-6 py-8 sm:px-8"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
        >
          <div className="absolute inset-x-10 top-10 h-28 rounded-full bg-gradient-to-r from-teal-200/45 to-amber-200/45 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="science-kicker">
                <Sparkles className="h-3.5 w-3.5" />
                {demoMains.length}
              </div>
              <div className="science-kicker">
                <Star className="h-3.5 w-3.5" />
                {demoStars.length}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4">
              {demoMains.map((n, index) => (
                <motion.div
                  key={n}
                  className="science-ball aspect-square bg-gradient-to-br from-teal-400 to-teal-600 text-2xl text-white sm:text-3xl"
                  initial={{ opacity: 0, y: 20, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -6 : 6 }}
                  transition={{ delay: 0.15 + index * 0.08, type: 'spring', stiffness: 220, damping: 15 }}
                >
                  {n}
                </motion.div>
              ))}

              {demoStars.map((n, index) => (
                <motion.div
                  key={`star-${n}`}
                  className="relative flex aspect-square items-center justify-center"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.08, type: 'spring', stiffness: 200, damping: 14 }}
                >
                  <Star className="absolute h-full w-full text-amber-400 fill-amber-300 drop-shadow-[0_10px_18px_rgba(245,158,11,0.35)]" />
                  <span className="relative z-10 font-display text-2xl font-extrabold text-amber-950 sm:text-3xl">{n}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-dashed border-slate-300/80 bg-white/78 px-5 py-4">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">{t('subtitle')}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="science-ball h-12 w-12 bg-white text-slate-700">?</div>
                <div className="science-ball h-12 w-12 bg-white text-slate-700">!</div>
                <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400" />
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
