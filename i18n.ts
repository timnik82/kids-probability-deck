import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale: string;
  try {
    locale = (await requestLocale) || 'ru';
  } catch {
    locale = 'ru';
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
