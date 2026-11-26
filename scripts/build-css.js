// Собирает CSS: dist/sloyka.css (всё), dist/core.css (слои, шрифты, токены, base),
// dist/components/<имя>.css (по компоненту) и копирует шрифты.
import { bundle } from 'lightningcss';
import { mkdirSync, writeFileSync, readdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const targets = { chrome: 111 << 16, safari: (16 << 16) | (4 << 8), firefox: 113 << 16 };
const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'components'), { recursive: true });
mkdirSync(join(out, 'fonts'), { recursive: true });

const build = (filename, dest, minify = false) => {
  const { code } = bundle({ filename, minify, targets });
  writeFileSync(join(out, dest), code);
};

build('src/index.css', 'sloyka.css');
build('src/index.css', 'sloyka.min.css', true);
build('src/core.css', 'core.css');
const comps = existsSync('src/components') ? readdirSync('src/components', { withFileTypes: true }).filter(d => d.isDirectory()) : [];
for (const d of comps) {
  const f = join('src/components', d.name, `${d.name}.css`);
  if (existsSync(f)) build(f, join('components', `${d.name}.css`));
}
for (const f of readdirSync('src/fonts')) copyFileSync(join('src/fonts', f), join(out, 'fonts', f));
console.log(`css: bundle + core + ${comps.length} components`);
