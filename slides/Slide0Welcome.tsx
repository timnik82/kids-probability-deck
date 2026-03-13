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
    <div className="deck-page-shell items-center">
      <div className="grid w-full max-w-[1100px] items-center gap-4 lg:grid-cols-[1.02fr_0.98fr] lg:gap-5">
        <section className="science-panel px-5 py-6 sm:px-6 sm:py-7">
          <motion.div
            className="science-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            5 + 2
          </motion.div>

          <motion.h1
            className="mt-4 max-w-[14ch] font-display text-[2.7rem] font-extrabold leading-[0.94] text-slate-800 sm:text-[3.55rem] lg:text-[4.25rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            {t('title')}
          </motion.h1>

          <motion.p
            className="mt-3 max-w-lg text-base font-semibold leading-7 text-slate-600 sm:text-[1.05rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            className="mt-6 science-panel bg-amber-50/80 px-4 py-4 sm:px-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex items-center gap-3">
              <div className="science-ball h-11 w-11 bg-amber-400 text-amber-950">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-800 sm:text-xl">{t('pickLang')}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
              <button
                onClick={() => switchTo('ru')}
                aria-pressed={locale === 'ru'}
                className={`flex-1 rounded-[1.3rem] border px-4 py-3 text-base font-extrabold transition-all sm:text-[1.05rem] ${
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
                className={`flex-1 rounded-[1.3rem] border px-4 py-3 text-base font-extrabold transition-all sm:text-[1.05rem] ${
                  locale === 'pt'
                    ? 'border-teal-200 bg-teal-500 text-white shadow-lg shadow-teal-900/15'
                    : 'border-white/80 bg-white text-slate-700 hover:border-teal-100 hover:bg-teal-50'
                }`}
              >
                Português
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button onClick={() => goTo(1)} className="science-button-primary min-h-[56px] px-6 text-base sm:text-lg">
              {t('start')}
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="rounded-[1.2rem] border border-dashed border-slate-300/80 bg-white/65 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              <span className="block font-display text-base tracking-normal text-slate-700">139 838 160</span>
              <span className="block">{t('ticketCountLabel')}</span>
            </div>
          </motion.div>
        </section>

        <motion.aside
          className="science-panel overflow-visible min-h-[370px] px-5 py-6 sm:px-6 sm:py-6"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
        >
          <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-gradient-to-r from-teal-200/40 to-amber-200/40 blur-3xl" />

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

            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {demoMains.map((n, index) => (
                <motion.div
                  key={n}
                  className="science-ball aspect-square bg-gradient-to-br from-teal-400 to-teal-600 text-xl text-white sm:text-2xl"
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
                  <span className="relative z-10 font-display text-xl font-extrabold text-amber-950 sm:text-2xl">{n}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-dashed border-slate-300/80 bg-white/[0.78] px-4 py-3.5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{t('experimentLabel')}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="science-ball h-10 w-10 bg-white text-slate-700">?</div>
                <div className="science-ball h-10 w-10 bg-white text-slate-700">!</div>
                <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400" />
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
