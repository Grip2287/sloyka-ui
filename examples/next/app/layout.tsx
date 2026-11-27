// Корневой layout Next: <html>, <head>, <body> здесь разрешены проверкой Sloyka.
import type { ReactNode } from 'react';
import 'sloyka/styles.css';
import { ThemeProvider, ThemeScript, ToastProvider } from 'sloyka';

export const metadata = { title: 'Пульт — пример Sloyka (Next.js)' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
