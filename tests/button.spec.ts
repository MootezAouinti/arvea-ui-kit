import { test, expect } from '@playwright/test';

test.describe('arvea-button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary&viewMode=story');
    await page.waitForSelector('arvea-button');
  });

  test('renders with correct text', async ({ page }) => {
    const button = page.locator('arvea-button');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Save changes');
  });

  test('renders primary variant with correct background', async ({ page }) => {
    const button = page.locator('arvea-button');
    const internalButton = button.locator('button');
    await expect(internalButton).toBeVisible();
    const bg = await internalButton.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    expect(bg).toBe('rgb(79, 70, 229)');
  });

  test('is focusable with keyboard', async ({ page }) => {
    await page.keyboard.press('Tab');
    const button = page.locator('arvea-button');
    const internalButton = button.locator('button');
    await expect(internalButton).toBeFocused();
  });

  test('is not clickable when disabled', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--disabled&viewMode=story');
    await page.waitForSelector('arvea-button');
    const button = page.locator('arvea-button');
    const internalButton = button.locator('button');
    await expect(internalButton).toBeDisabled();
  });

  test('shows spinner when loading', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading&viewMode=story');
    await page.waitForSelector('arvea-button');
    const button = page.locator('arvea-button');
    const spinner = button.locator('.spinner');
    await expect(spinner).toBeVisible();
  });

  test('all variants render correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--all-variants&viewMode=story');
    await page.waitForSelector('arvea-button');
    const buttons = page.locator('arvea-button');
    await expect(buttons).toHaveCount(4);
  });
});
