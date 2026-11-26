import { fileURLToPath } from 'node:url';
import { templateApiPlugin } from './template-api.js';

const templatesDir = fileURLToPath(new URL('../templates', import.meta.url));

/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  framework: { name: '@storybook/html-vite', options: {} },
  stories: ['../src/**/*.stories.js'],
  core: { disableTelemetry: true },
  // в режиме разработки Storybook умеет сохранять шаблон файлами в templates/
  viteFinal: config => ({ ...config, plugins: [...(config.plugins || []), templateApiPlugin(templatesDir)] }),
};
