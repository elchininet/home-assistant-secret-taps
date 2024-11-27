import { test, expect } from 'playwright-test-coverage';
import { CONFIG_FILES, SELECTORS } from './constants';
import {
    pageVisit,
    haConfigRequest,
    moveToHeader,
    tap,
    doubleTap
} from './utilities';

const TOAST_FAILURE = /^Failed.*?input_boolean\/toggle.*$/;
const VISIBILITY_OPTIONS = { timeout: 0 };

test.describe('Notifications disabled', () => {

    test.beforeAll(async ({ browser }) => {
        await haConfigRequest(browser, CONFIG_FILES.NOTIFICATIONS_DISABLED);
    });

    test('Successful action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await tap(page);
        await doubleTap(page);
        await tap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST);

        await expect(toast).not.toBeVisible(VISIBILITY_OPTIONS);

        await moveToHeader(page);
        await tap(page);
        await doubleTap(page);
        await tap(page);
        await page.waitForTimeout(1500);

        await expect(toast).not.toBeVisible(VISIBILITY_OPTIONS);

    });

    test('Unsuccessful action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await doubleTap(page);
        await tap(page);
        await doubleTap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST);

        await expect(toast).toBeVisible();
        await expect(toast).toContainText(TOAST_FAILURE);

    });

    test('Non-existent action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await doubleTap(page);
        await doubleTap(page);
        await page.waitForTimeout(1500);

        await expect(
            page.locator(SELECTORS.TOAST)
        ).not.toBeVisible(VISIBILITY_OPTIONS);

    });

});

test.describe('Notifications enabled', () => {

    test.beforeAll(async ({ browser }) => {
        await haConfigRequest(browser, CONFIG_FILES.NOTIFICATIONS_ENABLED);
    });

    test('Successful action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await tap(page);
        await doubleTap(page);
        await tap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST);

        await expect(toast).toBeVisible();
        await expect(toast).toContainText('secret taps successfully executed!');
        await expect(toast).not.toBeVisible();

        await moveToHeader(page);
        await tap(page);
        await doubleTap(page);
        await tap(page);
        await page.waitForTimeout(1500);

        await expect(toast).toBeVisible();
        await expect(toast).toContainText('secret taps successfully executed!');

    });

    test('Unsuccessful action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await doubleTap(page);
        await tap(page);
        await doubleTap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST);

        await expect(toast).toBeVisible();
        await expect(toast).toContainText(TOAST_FAILURE);

    });

    test('Non-existent action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await doubleTap(page);
        await doubleTap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST);

        await expect(toast).toBeVisible();
        await expect(toast).toContainText('secret taps failed! Review your secret config!');

    });

});