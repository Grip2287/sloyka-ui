import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import preserveDirectives from 'rollup-preserve-directives';

export default defineConfig(({ command }) => {
  // Пакет всегда собирается как production: иначе JSX компилируется в jsxDEV
  // (react/jsx-dev-runtime), и боевая сборка Next.js падает на пререндере.
  if (command === 'build') process.env.NODE_ENV = 'production';
  return config;
});

const config = {
  plugins: [react(), preserveDirectives()],
  build: {
    emptyOutDir: false,
    lib: { entry: 'src/react/index.ts', formats: ['es'] },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      output: { preserveModules: true, preserveModulesRoot: 'src/react', entryFileNames: '[name].js' },
    },
  },
};
