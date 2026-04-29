import { test, expect } from '@playwright/test';

test.describe('arvea-alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-alert--all-variants&viewMode=story');
    await page.waitForSelector('arvea-alert');
  });

  test('renders all 4 variants', async ({ page }) => {
    const alerts = page.locator('arvea-alert');
    await expect(alerts).toHaveCount(4);
  });

  test('renders success variant', async ({ page }) => {
    const alert = page.locator('arvea-alert[variant="success"]');
    await expect(alert).toBeVisible();
    const inner = alert.locator('.alert');
    await expect(inner).toHaveClass(/variant-success/);
  });

  test('renders warning variant', async ({ page }) => {
    const alert = page.locator('arvea-alert[variant="warning"]');
    await expect(alert).toBeVisible();
  });

  test('renders danger variant', async ({ page }) => {
    const alert = page.locator('arvea-alert[variant="danger"]');
    await expect(alert).toBeVisible();
  });

  test('renders info variant', async ({ page }) => {
    const alert = page.locator('arvea-alert[variant="info"]');
    await expect(alert).toBeVisible();
  });

  test('shows title correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=components-alert--default&viewMode=story');
    await page.waitForSelector('arvea-alert');
    const alert = page.locator('arvea-alert');
    const title = alert.locator('.alert-title');
    await expect(title).toContainText('Heads up');
  });

  test('dismiss button works', async ({ page }) => {
    await page.goto('/iframe.html?id=components-alert--dismissible&viewMode=story');
    await page.waitForSelector('arvea-alert');
    const alert = page.locator('arvea-alert');
    await expect(alert).toBeVisible();
    const dismissBtn = alert.locator('.dismiss-btn');
    await expect(dismissBtn).toBeVisible();
    await dismissBtn.click();
    await expect(alert).toBeHidden();
  });

  test('has correct aria role for danger variant', async ({ page }) => {
    await page.goto('/iframe.html?id=components-alert--all-variants&viewMode=story');
    await page.waitForSelector('arvea-alert');
    const alert = page.locator('arvea-alert[variant="danger"]').first();
    const inner = alert.locator('.alert');
    await expect(inner).toHaveAttribute('role', 'alert');
  });
});
