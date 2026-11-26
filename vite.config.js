import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: { sloyka: 'src/index.js', 'theme-init': 'src/theme-init.js', icons: 'src/icons.js' }, formats: ['es'] },
    rollupOptions: { output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' } },
  },
});
