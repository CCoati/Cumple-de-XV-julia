import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Great_Vibes } from 'next/font/google';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF8F5',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cumplejuliaxv.netlify.app'),
  title: 'Mis 15 — Julia | 28 de noviembre de 2026',
  description:
    'Estás invitado/a a celebrar los 15 años de Julia. 28 de noviembre de 2026. Confirmá tu asistencia.',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Mis 15 — Julia',
    description:
      'Estás invitado/a a celebrar los 15 años de Julia. 28 de noviembre de 2026.',
    url: 'https://cumplejuliaxv.netlify.app',
    siteName: 'Mis 15 — Julia',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mis 15 — Julia | 28 de noviembre de 2026',
      },
    ],
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mis 15 — Julia',
    description: 'Estás invitado/a a celebrar los 15 años de Julia. 28 de noviembre de 2026.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${cormorantGaramond.variable} ${greatVibes.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function removeNetlify() {
                  try {
                    var elements = document.querySelectorAll(
                      '#netlify-drawer, [data-netlify-drawer], [id^="netlify"], [class*="netlify"], iframe[src*="netlify"], iframe[title*="Netlify"], netlify-drawer, [data-testid*="netlify"], #feedback-widget-button, [aria-label*="Netlify"], .netlify-badge'
                    );
                    elements.forEach(function(el) {
                      if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                      }
                    });
                  } catch(e) {}
                }
                if (typeof document !== 'undefined') {
                  removeNetlify();
                  document.addEventListener('DOMContentLoaded', removeNetlify);
                  window.addEventListener('load', removeNetlify);
                  var observer = new MutationObserver(function() {
                    removeNetlify();
                  });
                  observer.observe(document.documentElement, { childList: true, subtree: true });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-svh bg-ivory text-forest antialiased">
        {children}
      </body>
    </html>
  );
}
