import { test, expect } from '@playwright/test';

/**
 * Test 1: Kommunsidan laddas.
 * Kontrollerar att rubriken "Översikt" och texten i högerpanelen syns.
 * Grönt: sidan och kartpanelen renderas.
 * Rött: sidan laddas inte, rutten /kommuner saknas, eller texterna har ändrats.
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
 * Test 2: Menylänkarna för Malmö och Lund fungerar.
 * Klickar på Malmö, Lund och Kartöversikt och kontrollerar att URL:en blir
 * /malmo, /lund respektive /kommuner.
 * Grönt: menylänkarna leder till rätt adress.
 * Rött: en länk saknas, fel adress, eller routingen i App.tsx stämmer inte.
 * Obs: testet kontrollerar inte innehållet på Malmö- och Lund-sidorna.
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
 * Test 3: Hover över en kommun ändrar högerpanelen.
 * Hovrar över region 1280 på kartan och kontrollerar att standardtexten
 * "Hovra över en kommun..." försvinner.
 * Grönt: panelen reagerar på hover.
 * Rött: hover ger ingen reaktion, eller data-code="1280" finns inte på kartan.
 * Obs: testet kontrollerar inte vad panelen visar i stället.
 */
test('hover över en kommun ändrar högerpanelen', async ({ page }) => {
  await page.goto('/kommuner');

  const region = page.locator('path.jvm-region[data-code="1280"]');
  await region.hover();

  await expect(
    page.getByText('Hovra över en kommun för att se data.')
  ).toHaveCount(0);
});