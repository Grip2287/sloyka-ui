import type { ReactNode } from 'react';
import { ThemeScript } from 'sloyka';
import 'sloyka/styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <ThemeScript />
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
