import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { Locale } from '../(features)/(internationlization)/i18n-config';

// import { Locale } from '@/features/internationalization/i18n-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "NextJs Template'",
  description: 'My nexjs template based on reactsquad.io tutorial',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
//   params: { lang: Locale };
}>) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
