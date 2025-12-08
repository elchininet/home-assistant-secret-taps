import {
    Browser,
    ConsoleMessage,
    Page
} from '@playwright/test';
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

export const waitForConsoleInfo = async (page: Page): Promise<void> => {
    return new Promise<void>((resolve) => {
        const listener = (message: ConsoleMessage): void => {
            if (
                message.type() === 'info' &&
                /HOME-ASSISTANT-SECRET-TAPS/.test(message.text())
            ) {
                page.off('console', listener);
                resolve();
            }
        };
        page.on('console', listener);
    });
};

export const waitForMainElements = async (page: Page): Promise<void> => {
    await expect(page.locator(SELECTORS.LAUNCH_SCREEN)).not.toBeInViewport({ timeout: 30000 });
    await expect(page.locator(SELECTORS.HOME_ASSISTANT)).toBeVisible();
    await expect(page.locator(SELECTORS.HOME_ASSISTANT_MAIN)).toBeVisible();
    await expect(page.locator(SELECTORS.HA_DRAWER)).toBeVisible();
    await expect(page.locator(SELECTORS.SIDEBAR)).toBeVisible();
    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();
};

export const pageVisit = async (page: Page): Promise<void> => {
    await page.goto('/');
    await waitForConsoleInfo(page);
    await page.waitForURL(/.*\/lovelace/);
    await waitForMainElements(page);
};

export async function haConfigRequest(page: Page, file?: string): Promise<void>;
export async function haConfigRequest(browser: Browser, file?: string): Promise<void>
export async function haConfigRequest(pageOrBrowser: Page | Browser, file = '') {
    const page = isBrowser(pageOrBrowser)
        ? await pageOrBrowser.newPage()
        : pageOrBrowser;
    page.route('**', route => route.continue());
    await pageVisit(page);
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
    await page.unrouteAll({ behavior: 'ignoreErrors' });
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

export const noCacheRoute = ({ page }: { page: Page }): void => {
    page.route('**', route => route.continue());
};