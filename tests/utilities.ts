import { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import {
    BASE_URL,
    SELECTORS,
    MAXIMUM_RETRIES,
    RETRY_DELAY,
    CONFIG_PATH
} from './constants';

export const pageVisit = async (page: Page): Promise<void> => {
    await page.goto('/');
    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();
};

export const haConfigRequest = async (file: string = '', retries = 0) => {
    return fetch(
        `${BASE_URL}/api/services/shell_command/copy_config`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HA_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                yaml: file
            })
        }
    ).then((response: Response) => {
        if (response.ok || retries >= MAXIMUM_RETRIES) {
            return response;
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    haConfigRequest(file, retries + 1)
                );
            }, RETRY_DELAY);
        });
    });
};

export const moveToHeader = async (page:Page) => {
    await page.mouse.move(300, 15);
};

export const tap = async (page: Page) => {
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(500);
};

export const doubleTap = async (page: Page) => {
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(500);
};

export const tripleTap = async (page: Page) => {
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(500);
};

export const fulfillYaml = async (page: Page, yaml: string): Promise<void> => {
    await page.route(CONFIG_PATH, async route => {
        await route.fulfill({ body: yaml });
    });
};