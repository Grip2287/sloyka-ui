import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'happy-dom', include: ['tests/unit/**/*.test.js'], globalSetup: ['tests/unit/global-setup.js'] } });
