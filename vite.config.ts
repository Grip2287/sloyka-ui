import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import preserveDirectives from 'rollup-preserve-directives';

export default defineConfig({
  plugins: [react(), preserveDirectives()],
  build: {
    emptyOutDir: false,
    lib: { entry: 'src/react/index.ts', formats: ['es'] },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      output: { preserveModules: true, preserveModulesRoot: 'src/react', entryFileNames: '[name].js' },
    },
  },
});
