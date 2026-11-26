import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], test: { environment: 'happy-dom', include: ['tests/unit/**/*.test.{js,ts,tsx}'], globalSetup: ['tests/unit/global-setup.js'] } });
