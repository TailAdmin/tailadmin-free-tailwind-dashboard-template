import { test, expect } from '@playwright/test';

/**
 * Test 1: The municipality page loads.
 * Checks that the "Översikt" heading and the default text in the side panel are visible.
 * Pass: the page and the map panel render.
 * Fail: the page does not load, the /kommuner route is missing, or the texts have changed.
 */
test('kommunsidan visar kartan och hover-texten', async ({ page }) => {
  await page.goto('/kommuner');

  await expect(
    page.locator('label', { hasText: /^Översikt$/ })
  ).toBeVisible();
  await expect(
    page.getByText('Hovra över en kommun för att se data.')
  ).toBeVisible();
});

/**
 * Test 2: The Malmö and Lund menu links work.
 * Clicks Malmö, Lund and Kartöversikt and checks that the URL becomes
 * /malmo, /lund and /kommuner respectively.
 * Pass: the menu links lead to the correct addresses.
 * Fail: a link is missing, the address is wrong, or the routing in App.tsx does not match.
 * Note: the test does not check the content of the Malmö and Lund pages.
 */
test('Malmö- och Lund-länkarna går till rätt adress', async ({ page }) => {
  await page.goto('/kommuner');

  await page.getByRole('link', { name: 'Malmö' }).click();
  await expect(page).toHaveURL(/\/malmo$/);

  await page.getByRole('link', { name: 'Lund' }).click();
  await expect(page).toHaveURL(/\/lund$/);

  await page.getByRole('link', { name: 'Kartöversikt' }).click();
  await expect(page).toHaveURL(/\/kommuner$/);
});

/**
 * Test 3: Hovering over a municipality changes the side panel.
 * Hovers over region 1280 on the map and checks that the default text
 * "Hovra över en kommun..." disappears.
 * Pass: the panel reacts to the hover.
 * Fail: the hover has no effect, or data-code="1280" does not exist on the map.
 * Note: the test does not check what the panel shows instead.
 */
test('hover över en kommun ändrar högerpanelen', async ({ page }) => {
  await page.goto('/kommuner');

  const region = page.locator('path.jvm-region[data-code="1280"]');
  await region.hover();

  await expect(
    page.getByText('Hovra över en kommun för att se data.')
  ).toHaveCount(0);
});