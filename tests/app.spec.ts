import { test, expect } from '@playwright/test';

test.describe('Decision Matrix App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Decision Matrix');
  });

  test('default options are visible', async ({ page }) => {
    const optionInputs = page.locator('.option-chip input');
    await expect(optionInputs).toHaveCount(3);

    const values = await optionInputs.evaluateAll((inputs) =>
      (inputs as HTMLInputElement[]).map((i) => i.value),
    );
    expect(values).toEqual(['React', 'Vue', 'Svelte']);
  });

  test('default criteria are visible', async ({ page }) => {
    const criteriaInputs = page.locator('.criterion-name');
    await expect(criteriaInputs).toHaveCount(4);

    const values = await criteriaInputs.evaluateAll((inputs) =>
      (inputs as HTMLInputElement[]).map((i) => i.value),
    );
    expect(values).toEqual(['Learning Curve', 'Performance', 'Ecosystem', 'DX']);
  });

  test('add option adds a new column', async ({ page }) => {
    await expect(page.locator('.option-chip')).toHaveCount(3);
    await page.getByRole('button', { name: '+ Add Option' }).click();
    await expect(page.locator('.option-chip')).toHaveCount(4);

    // New option should appear in the scoring table header
    const headers = page.locator('.scoring-grid th');
    await expect(headers).toHaveCount(6); // Criteria + Weight + 4 options
  });

  test('add criterion adds a new row', async ({ page }) => {
    await expect(page.locator('.criterion-row')).toHaveCount(4);
    await page.getByRole('button', { name: '+ Add Criterion' }).click();
    await expect(page.locator('.criterion-row')).toHaveCount(5);

    // New criterion should appear in the scoring table
    const tableRows = page.locator('.scoring-grid tbody tr');
    await expect(tableRows).toHaveCount(5);
  });

  test('results display with scores and bar chart', async ({ page }) => {
    const resultsSection = page.locator('.results');
    await expect(resultsSection).toBeVisible();
    await expect(resultsSection.locator('h2')).toHaveText('Results');

    // Each option should have a result row with rank, name, bar, and score
    const resultRows = page.locator('.result-row');
    await expect(resultRows).toHaveCount(3);

    // Check that scores are percentages
    const scores = page.locator('.result-score');
    const scoreTexts = await scores.allTextContents();
    for (const text of scoreTexts) {
      expect(text).toMatch(/\d+(\.\d+)?%/);
    }

    // Check that bars exist
    const bars = page.locator('.result-bar');
    await expect(bars).toHaveCount(3);
  });

  test('modifying a score updates results', async ({ page }) => {
    // Get initial top result score
    const firstScore = page.locator('.result-score').first();
    const initialText = await firstScore.textContent();

    // Change the first score slider to max (10)
    const firstSlider = page.locator('.score-cell input[type="range"]').first();
    await firstSlider.fill('10');

    // Also change another slider to 1 to force a visible difference
    const secondSlider = page.locator('.score-cell input[type="range"]').nth(1);
    await secondSlider.fill('1');

    // Results should have updated — at least one score should differ
    const updatedScores = await page.locator('.result-score').allTextContents();
    const hasChanged = updatedScores.some((s) => s !== initialText);
    expect(hasChanged).toBe(true);
  });

  test('share URL updates location with encoded state', async ({ page }) => {
    // Monkey-patch clipboard.writeText on the already-loaded page
    await page.evaluate(() => {
      (window as any).__clipboardData = '';
      const origWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = (text: string) => {
        (window as any).__clipboardData = text;
        return origWriteText(text).catch(() => Promise.resolve());
      };
    });

    const shareBtn = page.getByRole('button', { name: '🔗 Share URL' });
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();

    // Wait for state update
    await page.waitForTimeout(500);

    // The URL should now contain encoded state via replaceState
    const url = page.url();
    expect(url).toContain('?m=');

    // Clipboard data should contain the URL
    const clipboardText = await page.evaluate(() => (window as any).__clipboardData);
    expect(clipboardText).toMatch(/^https?:\/\//);
    expect(clipboardText).toContain('?m=');
  });

  test('export markdown copies markdown output', async ({ page }) => {
    // Monkey-patch clipboard.writeText on the already-loaded page
    await page.evaluate(() => {
      (window as any).__clipboardData = '';
      const origWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = (text: string) => {
        (window as any).__clipboardData = text;
        return origWriteText(text).catch(() => Promise.resolve());
      };
    });

    const exportBtn = page.getByRole('button', { name: '📋 Copy as Markdown' });
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    // Wait for state update
    await page.waitForTimeout(500);

    // Verify markdown content was captured
    const clipboardText = await page.evaluate(() => (window as any).__clipboardData);
    expect(clipboardText).toContain('# Decision Matrix');
    expect(clipboardText).toContain('React');
    expect(clipboardText).toContain('Vue');
    expect(clipboardText).toContain('Svelte');
    expect(clipboardText).toContain('Results');
  });
});
