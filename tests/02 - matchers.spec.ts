import { test, expect } from 'playwright-test-coverage';
import { CONFIG_FILES, SELECTORS } from './constants';
import {
    haConfigRequest,
    pageVisit,
    moveToHeader,
    tap,
    doubleTap,
    tripleTap
} from './utilities';

test('Non-matching users', async ({ page }) => {

    await haConfigRequest(page, CONFIG_FILES.NON_MATCHING_USERS);

    await pageVisit(page);

    // Switch
    await moveToHeader(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.MY_SWITCH)
    ).toHaveAttribute('aria-checked', 'false');

    // Sidebar
    await moveToHeader(page);
    await tap(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.SIDEBAR)
    ).toHaveAttribute('expanded');

    // More-info dialog
    await moveToHeader(page);
    await doubleTap(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.MORE_INFO_DIALOG)
    ).not.toBeInViewport();

});

test('Matching users', async ({ page }) => {

    await haConfigRequest(page, CONFIG_FILES.MATCHING_USERS);

    await pageVisit(page);

    // Switch
    await moveToHeader(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.MY_SWITCH)
    ).toHaveAttribute('aria-checked', 'true');

    await moveToHeader(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.MY_SWITCH)
    ).toHaveAttribute('aria-checked', 'false');

    // Sidebar
    await moveToHeader(page);
    await tap(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.SIDEBAR)
    ).not.toHaveAttribute('expanded');

    await moveToHeader(page);
    await tap(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.SIDEBAR)
    ).toHaveAttribute('expanded');

    // More-info dialog
    await moveToHeader(page);
    await doubleTap(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.MORE_INFO_DIALOG)
    ).toBeInViewport();
    await expect(
        page.locator(SELECTORS.DIALOG_HEADER_TITLE)
    ).toContainText('laundry');

});

test('Not enabled', async ({ page }) => {

    await haConfigRequest(page, CONFIG_FILES.NOT_ENABLED);

    await pageVisit(page);

    // Sidebar
    await moveToHeader(page);
    await tap(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(
        page.locator(SELECTORS.SIDEBAR)
    ).toHaveAttribute('expanded');

});