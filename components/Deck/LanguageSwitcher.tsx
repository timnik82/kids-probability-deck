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
    <div className="flex gap-1.5 rounded-full bg-white/82 p-1.5 shadow-sm ring-1 ring-slate-200/80">
      <button
        onClick={() => switchTo('ru')}
        aria-pressed={locale === 'ru'}
        className={`min-h-[44px] min-w-[58px] rounded-full px-3.5 py-2 text-sm font-extrabold transition-all ${
          locale === 'ru'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-teal-900/15'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => switchTo('pt')}
        aria-pressed={locale === 'pt'}
        className={`min-h-[44px] min-w-[58px] rounded-full px-3.5 py-2 text-sm font-extrabold transition-all ${
          locale === 'pt'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-teal-900/15'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        PT
      </button>
    </div>
  );
}
