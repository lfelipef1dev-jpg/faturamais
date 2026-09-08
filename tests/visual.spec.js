import { test } from '@playwright/test';

test('Screenshots — landing e app', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/landing-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/landing-mobile.png', fullPage: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/app.html#/dashboard');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/app-dashboard.png', fullPage: true });
});
