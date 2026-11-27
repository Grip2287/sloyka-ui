import tseslint from 'typescript-eslint';
import sloyka from 'sloyka/eslint';

export default [
  { files: ['**/*.{ts,tsx}'], languageOptions: { parser: tseslint.parser } },
  sloyka.configs.recommended,
];
