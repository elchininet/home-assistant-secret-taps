import { test, expect } from 'playwright-test-coverage';
import {
    BASE_URL,
    CONFIG_FILES,
    SELECTORS
} from './constants';
import {
    pageVisit,
    haConfigRequest,
    moveToHeader,
    tap,
    doubleTap,
    tripleTap
} from './utilities';

test.beforeAll(async () => {
    await haConfigRequest(CONFIG_FILES.BASIC);
});

test('Call service', async ({ page }) => {

    await pageVisit(page);

    const mySwitch = page.locator(SELECTORS.MY_SWITCH);

    await expect(mySwitch).toHaveAttribute('aria-checked', 'false');

    await moveToHeader(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(mySwitch).toHaveAttribute('aria-checked', 'true');

    await moveToHeader(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(mySwitch).toHaveAttribute('aria-checked', 'false');

});

test('Open and close sidebar', async ({ page }) => {

    await pageVisit(page);

    const sidebar = page.locator(SELECTORS.SIDEBAR);

    await expect(sidebar).toHaveAttribute('expanded');

    await moveToHeader(page);
    await tap(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(sidebar).not.toHaveAttribute('expanded');

    await moveToHeader(page);
    await tap(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(sidebar).toHaveAttribute('expanded');

});

test('Open more-info dialog', async ({ page }) => {

    await pageVisit(page);

    const dialog = page.locator(SELECTORS.MORE_INFO_DIALOG);
    const dialogTitle = page.locator(SELECTORS.DIALOG_HEADER_TITLE);

    await expect(dialog).not.toBeInViewport();

    await moveToHeader(page);
    await doubleTap(page);
    await tap(page);
    await doubleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    await expect(dialog).toBeInViewport();
    await expect(dialogTitle).toContainText('laundry');

});

test('Navigate to a panel', async ({ page }) => {

    await pageVisit(page);

    await moveToHeader(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    expect(page.url()).toBe(`${BASE_URL}/config/dashboard`);

    await page.goBack();

    expect(page.url()).toBe(`${BASE_URL}/lovelace/home`);

});

test('Navigate to a panel replacing history', async ({ page }) => {

    await pageVisit(page);

    await moveToHeader(page);
    await tripleTap(page);
    await tap(page);
    await tripleTap(page);
    await page.waitForTimeout(1500);

    expect(page.url()).toBe(`${BASE_URL}/media-browser/browser`);

    await page.goBack();

    expect(page.url()).not.toBe(`${BASE_URL}/lovelace/home`);

});

test('Execute a JavaScript code', async ({ page }) => {

    await pageVisit(page);

    expect(page.url()).toBe(`${BASE_URL}/lovelace/home`);

    await moveToHeader(page);
    await doubleTap(page);
    await tap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    expect(page.url()).toBe(`${BASE_URL}/lovelace/home#something`);

});