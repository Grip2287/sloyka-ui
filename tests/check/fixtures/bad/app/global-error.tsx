// expect: no-native-elements@7, no-native-elements@8
export default function GlobalError() {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <style>{'a{}'}</style>
        <script dangerouslySetInnerHTML={{ __html: 'x' }} />
      </head>
      <body />
    </html>
  );
}
