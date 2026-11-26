import { fileURLToPath } from 'node:url';
import { templateApiPlugin } from './template-api.js';
import { referenceApiPlugin } from './reference-api.js';

const templatesDir = fileURLToPath(new URL('../templates', import.meta.url));
const referencesDir = fileURLToPath(new URL('../references', import.meta.url));

/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  framework: { name: '@storybook/html-vite', options: {} },
  stories: ['../src/**/*.stories.js'],
  core: { disableTelemetry: true },
  // в режиме разработки Storybook сохраняет шаблоны в templates/ и референсы в references/
  viteFinal: config => ({ ...config, plugins: [...(config.plugins || []), templateApiPlugin(templatesDir), referenceApiPlugin(referencesDir)] }),
};
