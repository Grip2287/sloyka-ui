import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  use: { baseURL: 'http://127.0.0.1:6007' },
  webServer: [
    { command: 'npx http-server storybook-static -p 6007 -s -c-1', url: 'http://127.0.0.1:6007/index.json', reuseExistingServer: true },
    { command: 'npx http-server . -p 6008 -s -c-1', url: 'http://127.0.0.1:6008/package.json', reuseExistingServer: true },
  ],
  projects: [
    { name: 'stories' , testMatch: /stories\.spec/ },
    { name: 'layers', testMatch: /layers\.spec/ },
    { name: 'behaviour', testMatch: /behaviour\.spec/ },
    { name: 'no-js', testMatch: /nojs\.spec/, use: { javaScriptEnabled: false } },
  ],
});
