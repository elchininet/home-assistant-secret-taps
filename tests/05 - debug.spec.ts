import { test, expect } from 'playwright-test-coverage';
import { CONFIG_FILES } from './constants';
import {
    pageVisit,
    haConfigRequest,
    moveToHeader,
    tap,
    doubleTap,
    tripleTap
} from './utilities';

const NAMESPACE = 'home-assistant-secret-taps:';

const SECRETS = [
    {
        taps: [
            'double-tap',
            'tap',
            'tap'
        ],
        action: 'call-service',
        service: 'input_boolean.toggle',
        data: {
            'entity_id': 'input_boolean.my_switch'
        }
    },
    {
        taps: [
            'triple-tap',
            'tap'
        ],
        action: 'invalid-service'
    }
];

const JSON_CONFIG = {
    enabled: true,
    debug: true,
    profiles: [
        {
            user: 'Test',
            secrets: SECRETS
        }
    ]
};

const prefixNameSpace = (logs: string[]): string[] => {
    return logs.map((log: string) => `${NAMESPACE} ${log}`);
};

const stringfy = (obj: object): string => JSON.stringify(obj, null, 4);

const resetLogs = (logs: string[]): void => {
    logs.splice(0);
};

test.beforeAll(async () => {
    await haConfigRequest(CONFIG_FILES.DEBUG);
});

test('Debug logs', async ({ page }) => {

    const logs: string[] = [];

    page.on('console', message => {
        if (message.type() === 'log') {
            logs.push(
                message.text()
            );
        }
    });

    await pageVisit(page);

    expect(logs).toMatchObject(
        expect.arrayContaining(
            prefixNameSpace([
                'configuration loaded, printing configuration...',
                stringfy(JSON_CONFIG),
                'secrets queried for Test, printing secrets...',
                stringfy(SECRETS)
            ])
        )
    );

    resetLogs(logs);

    await moveToHeader(page);
    await doubleTap(page);
    await tap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    expect(logs).toMatchObject(
        expect.arrayContaining(
            prefixNameSpace([
                'event double-tap fired',
                'printig event stack...',
                'double-tap',
                'event tap fired',
                'printig event stack...',
                'double-tap » tap',
                'event tap fired',
                'printig event stack...',
                'double-tap » tap » tap',
                'checking if there is a scret with the previous event stack',
                'secret found, executing secret',
                'secret executed!',
                stringfy(SECRETS[0])
            ])
        )
    );

    resetLogs(logs);

    await moveToHeader(page);
    await tap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    expect(logs).toMatchObject(
        expect.arrayContaining(
            prefixNameSpace([
                'event tap fired',
                'printig event stack...',
                'tap',
                'event tap fired',
                'printig event stack...',
                'tap » tap',
                'checking if there is a scret with the previous event stack'
            ])
        )
    );

    resetLogs(logs);

    await moveToHeader(page);
    await tripleTap(page);
    await tap(page);
    await page.waitForTimeout(1500);

    expect(logs).toMatchObject(
        expect.arrayContaining(
            prefixNameSpace([
                'event triple-tap fired',
                'printig event stack...',
                'triple-tap',
                'event tap fired',
                'printig event stack...',
                'triple-tap » tap',
                'checking if there is a scret with the previous event stack',
                'secret found, executing secret',
                'secret NOT executed! secret with errors',
                stringfy(SECRETS[1])
            ])
        )
    );

});

