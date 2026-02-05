'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchTo = (target: string) => {
    if (target === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${target}`);
    const qs = searchParams.toString();
    router.push(qs ? `${newPath}?${qs}` : newPath);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', target);
    }
  };

  return (
    <div className="flex gap-1 rounded-full bg-white/80 backdrop-blur p-1 shadow-md">
      <button
        onClick={() => switchTo('ru')}
        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
          locale === 'ru'
            ? 'bg-teal-600 text-white shadow'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => switchTo('pt')}
        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
          locale === 'pt'
            ? 'bg-teal-600 text-white shadow'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        PT
      </button>
    </div>
  );
}
