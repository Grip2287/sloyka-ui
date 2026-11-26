// Собирает CSS: dist/styles.css (слои, шрифты, токены, base, компоненты) и копирует шрифты.
import { bundle } from 'lightningcss';
import { mkdirSync, writeFileSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const targets = { chrome: 111 << 16, safari: (16 << 16) | (4 << 8), firefox: 113 << 16 };
const out = 'dist';
const LAYERS = '@layer sl.reset, sl.tokens, sl.base, sl.components;';
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'fonts'), { recursive: true });

const { code } = bundle({ filename: 'src/index.css', targets });
// порядок слоёв объявляем явно в начале файла: так стили сайта вне слоёв всегда сильнее
writeFileSync(join(out, 'styles.css'), `${LAYERS}\n${code}`);
for (const f of readdirSync('src/fonts')) copyFileSync(join('src/fonts', f), join(out, 'fonts', f));
console.log('css: dist/styles.css + fonts');
