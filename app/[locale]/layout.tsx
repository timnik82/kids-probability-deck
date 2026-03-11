import { Nunito, Rubik } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';

const bodyFont = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600', '700', '800'],
});

const displayFont = Rubik({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'pt' }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
