'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  goTo: (n: number) => void;
}

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
    <div className="flex flex-col items-center justify-center text-center gap-8 max-w-lg mx-auto py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-slate-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t('title')}
      </motion.h1>

      <motion.p
        className="text-xl text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {t('subtitle')}
      </motion.p>

      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm font-medium text-slate-500">{t('pickLang')}</p>
        <div className="flex gap-4">
          <button
            onClick={() => switchTo('ru')}
            className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all active:scale-95 shadow-md ${
              locale === 'ru'
                ? 'bg-teal-600 text-white shadow-teal-200'
                : 'bg-white text-slate-700 hover:bg-teal-50 border-2 border-slate-200'
            }`}
          >
            Русский
          </button>
          <button
            onClick={() => switchTo('pt')}
            className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all active:scale-95 shadow-md ${
              locale === 'pt'
                ? 'bg-teal-600 text-white shadow-teal-200'
                : 'bg-white text-slate-700 hover:bg-teal-50 border-2 border-slate-200'
            }`}
          >
            Portugues
          </button>
        </div>
      </motion.div>

      <motion.button
        onClick={() => goTo(1)}
        className="px-10 py-4 rounded-2xl bg-amber-500 text-white text-xl font-bold shadow-lg shadow-amber-200
          hover:bg-amber-600 active:scale-95 transition-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('start')}
      </motion.button>
    </div>
  );
}
