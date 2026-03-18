import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4175',
    headless: true,
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4175',
    port: 4175,
    reuseExistingServer: false,
  },
});
