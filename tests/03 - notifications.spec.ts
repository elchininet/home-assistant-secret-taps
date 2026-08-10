import { test, expect } from 'playwright-test-coverage';
import { CONFIG_FILES, SELECTORS } from './constants';
import {
    doubleTap,
    haConfigRequest,
    moveToHeader,
    pageVisit,
    noCacheRoute,
    tap
} from './utilities';

const TOAST_SUCCESS = 'secret taps successfully executed!';
const TOAST_FAILURE = /^Failed.*?input_boolean\/toggle.*$/;
const TOAST_NON_EXISTENT = 'secret taps failed! Review your secret config!';
const VISIBILITY_OPTIONS = { timeout: 0 };

test.beforeEach(noCacheRoute);

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

        const toast = page.locator(SELECTORS.TOAST).filter({ hasText: TOAST_FAILURE });

        await expect(toast).toBeVisible();

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

        const toast = page.locator(SELECTORS.TOAST).filter({ hasText: TOAST_SUCCESS });

        await expect(toast).toBeVisible();
        await expect(toast).not.toBeVisible();

        await moveToHeader(page);
        await tap(page);
        await doubleTap(page);
        await tap(page);
        await page.waitForTimeout(1500);

        await expect(toast).toBeVisible();

    });

    test('Unsuccessful action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await doubleTap(page);
        await tap(page);
        await doubleTap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST).filter({ hasText: TOAST_FAILURE });

        await expect(toast).toBeVisible();

    });

    test('Non-existent action', async ({ page }) => {

        await pageVisit(page);

        await moveToHeader(page);
        await doubleTap(page);
        await doubleTap(page);
        await page.waitForTimeout(1500);

        const toast = page.locator(SELECTORS.TOAST).filter({ hasText: TOAST_NON_EXISTENT });

        await expect(toast).toBeVisible();

    });

});