// ESLint 9 (flat config): import sloyka from 'sloyka/eslint'; export default [sloyka.configs.recommended];
import { createAnalyzer } from './analyze.js';
import { RULE_IDS, RULE_DOCS, loadManifest } from './rules.js';

const rules = Object.fromEntries(
  RULE_IDS.map(id => [
    id,
    {
      meta: { type: 'problem', docs: { description: RULE_DOCS[id] }, schema: [], messages: { violation: '{{ message }}' } },
      create(context) {
        return createAnalyzer({
          filename: context.filename,
          manifest: loadManifest(),
          enabled: [id],
          report: ({ line, message }) => context.report({ loc: { line, column: 0 }, messageId: 'violation', data: { message } }),
        });
      },
    },
  ]),
);

const plugin = { meta: { name: 'sloyka' }, rules, configs: {} };
plugin.configs.recommended = {
  name: 'sloyka/recommended',
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
  plugins: { sloyka: plugin },
  rules: Object.fromEntries(RULE_IDS.map(id => [`sloyka/${id}`, 'error'])),
};

export { rules };
export const configs = plugin.configs;
export default plugin;
