import { test } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('capture full page screenshot', async ({ page }) => {
  await page.goto('/');

  // Wait for the results section to be rendered
  await page.locator('.results').waitFor({ state: 'visible' });

  await page.screenshot({
    path: join(__dirname, '..', 'screenshot.png'),
    fullPage: true,
  });
});
