import { test, expect } from '@playwright/test';

test.describe('arvea-input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-input--default&viewMode=story');
    await page.waitForSelector('arvea-input');
  });

  test('renders label correctly', async ({ page }) => {
    const input = page.locator('arvea-input');
    await expect(input).toBeVisible();
    const label = input.locator('label');
    await expect(label).toContainText('Email address');
  });

  test('renders placeholder correctly', async ({ page }) => {
    const input = page.locator('arvea-input');
    const internalInput = input.locator('input');
    await expect(internalInput).toHaveAttribute('placeholder', 'you@example.com');
  });

  test('accepts text input', async ({ page }) => {
    const input = page.locator('arvea-input');
    const internalInput = input.locator('input');
    await internalInput.fill('test@example.com');
    await expect(internalInput).toHaveValue('test@example.com');
  });

  test('is focusable', async ({ page }) => {
    const input = page.locator('arvea-input');
    const internalInput = input.locator('input');
    await internalInput.click();
    await expect(internalInput).toBeFocused();
  });

  test('shows error message', async ({ page }) => {
    await page.goto('/iframe.html?id=components-input--with-error&viewMode=story');
    await page.waitForSelector('arvea-input');
    const input = page.locator('arvea-input');
    const error = input.locator('.error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Please enter a valid email address');
  });

  test('shows hint message', async ({ page }) => {
    await page.goto('/iframe.html?id=components-input--with-hint&viewMode=story');
    await page.waitForSelector('arvea-input');
    const input = page.locator('arvea-input');
    const hint = input.locator('.hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Must be at least 3 characters');
  });

  test('shows required marker', async ({ page }) => {
    await page.goto('/iframe.html?id=components-input--required&viewMode=story');
    await page.waitForSelector('arvea-input');
    const input = page.locator('arvea-input');
    const requiredMark = input.locator('.required-mark');
    await expect(requiredMark).toBeVisible();
  });
});
