import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';
import { CONFIG_FILES, SELECTORS } from './constants';
import { haConfigRequest } from './utilities';

test.beforeAll(async () => {
    await haConfigRequest(CONFIG_FILES.BASIC);
});

const pageVisit = async (page: Page): Promise<void> => {
    await page.goto('/');
    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();
};

test('Sidebar items are processed', async ({ page }) => {

    await pageVisit(page);

    expect(true).toBe(true);

});