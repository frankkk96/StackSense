import type { Metadata, Viewport } from 'next';
import { siteTitle, siteDescription } from '../src/data/site';
import { DEFAULT_LOCALE } from '../src/data/types';
import '../src/styles/global.css';

// Build-time metadata uses the default locale. The runtime UI swaps strings
// client-side based on the user's saved preference, but search engines and
// social cards see the default-locale copy.
export const metadata: Metadata = {
  title: {
    default: `StackSense · ${siteTitle[DEFAULT_LOCALE]}`,
    template: `%s · StackSense`,
  },
  description: siteDescription[DEFAULT_LOCALE],
  metadataBase: new URL('https://stacksense.cc'),
  openGraph: {
    type: 'website',
    locale: DEFAULT_LOCALE === 'zh' ? 'zh_CN' : 'en_US',
    siteName: 'StackSense',
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#161717',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_LOCALE === 'zh' ? 'zh-CN' : 'en'}>
      <head>
        {/* Google tag (gtag.js) — preserved from previous Astro setup */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TPD0660043"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TPD0660043');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
