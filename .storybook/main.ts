import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { templateApiPlugin } from './template-api.js';
import { referenceApiPlugin } from './reference-api.js';

const templatesDir = fileURLToPath(new URL('../templates', import.meta.url));
const referencesDir = fileURLToPath(new URL('../references', import.meta.url));

const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.stories.tsx'],
  core: { disableTelemetry: true },
  // в режиме разработки Storybook сохраняет шаблоны в templates/ и референсы в references/
  viteFinal: (config) => ({ ...config, plugins: [...(config.plugins || []), templateApiPlugin(templatesDir), referenceApiPlugin(referencesDir)] }),
};
export default config;
