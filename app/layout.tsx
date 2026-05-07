import type { Metadata, Viewport } from 'next';
import { siteTitle, siteDescription } from '../src/data/site';
import '../src/styles/global.css';

export const metadata: Metadata = {
  title: {
    default: `StackSense · ${siteTitle}`,
    template: `%s · StackSense`,
  },
  description: siteDescription,
  metadataBase: new URL('https://stacksense.cc'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
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
    <html lang="zh-CN">
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
