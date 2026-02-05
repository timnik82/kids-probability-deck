import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'pt'],
  defaultLocale: 'ru',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(ru|pt)/:path*'],
};
