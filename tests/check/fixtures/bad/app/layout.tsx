// expect: no-native-elements@9
import { ThemeScript } from 'sloyka';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head><ThemeScript /></head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
