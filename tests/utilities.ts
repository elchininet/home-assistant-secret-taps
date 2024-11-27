import { Page, Browser } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { SELECTORS, CONFIG_PATH } from './constants';

interface Context {
    id: string;
    user_id: string;
}

interface HomeAssistant extends HTMLElement {
    hass: {
        callService: (domain: string, service: string, data: Record<string, unknown>) => Promise<Context>;
    };
}

const isBrowser = (pageOrBrowser: Page | Browser): pageOrBrowser is Browser => {
    return 'newPage' in pageOrBrowser && typeof pageOrBrowser.newPage === 'function';
};

export const pageVisit = async (page: Page): Promise<void> => {
    await page.goto('/');
    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();
};

export async function haConfigRequest(page: Page, file?: string): Promise<void>;
export async function haConfigRequest(browser: Browser, file?: string): Promise<void>
export async function haConfigRequest(pageOrBrowser: Page | Browser, file = '') {
    const page = isBrowser(pageOrBrowser)
        ? await pageOrBrowser.newPage()
        : pageOrBrowser;
    await page.goto('/');
    await expect(page.locator(SELECTORS.SIDEBAR)).toBeVisible();
    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();
    await page.evaluate(async (file: string) => {
        const homeAssistant = document.querySelector('home-assistant') as HomeAssistant;
        await homeAssistant.hass.callService(
            'shell_command',
            'copy_config',
            {
                yaml: file
            }
        );
    }, file);
    if (isBrowser(pageOrBrowser)) {
        page.close();
    }
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