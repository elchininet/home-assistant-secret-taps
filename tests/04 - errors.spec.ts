import { test, expect } from 'playwright-test-coverage';
import { CONFIG_PATH } from './constants';
import {
    fulfillYaml,
    haConfigRequest,
    pageVisit,
    noCacheRoute
} from './utilities';

test.beforeEach(async ({ page, browser }): Promise<void> => {
    noCacheRoute({ page });
    await haConfigRequest(browser);
});

const ERROR_PREFIX = 'home-assistant-secret-taps:';
const NOT_FOUND_ERROR = `${ERROR_PREFIX} YAML config file not found.\nMake sure you have valid config in /config/www/secret-taps.yaml file.`;

test('No configuration', async ({ page }) => {

    const errors: string[] = [];

    page.on('pageerror', error => {
        errors.push(error.message);
    });

    await pageVisit(page);

    expect(errors).toEqual(
        expect.arrayContaining([NOT_FOUND_ERROR])
    );

});

test('Server error', async ({ page }) => {

    const errors: string[] = [];

    await page.route(CONFIG_PATH, async route => {
        await route.fulfill({
            status: 500,
            contentType: 'text/plain',
            body: 'Server error!'
        });
    });

    page.on('pageerror', error => {
        errors.push(error.message);
    });

    await pageVisit(page);

    expect(errors).toEqual(
        expect.arrayContaining([NOT_FOUND_ERROR])
    );

});

test('Non valid yaml', async ({ page }) => {

    const errors: string[] = [];

    await fulfillYaml(page, '*');

    page.on('pageerror', error => {
        errors.push(error.message.replace(/\n+/g, ' '));
    });

    await pageVisit(page);

    expect(errors).toEqual(
        expect.arrayContaining([
            `${ERROR_PREFIX} name of an alias node must contain at least one character (1:2)  1 | * ------^`
        ])
    );

});