import { NAMESPACE } from '@constants';

export const MAX_ATTEMPTS = 100;
export const RETRY_DELAY = 50;

const getPromisableElement = <T>(
    getElement: () => T,
    check: (element: T) => boolean
): Promise<T> => {
    return new Promise<T>((resolve) => {
        let attempts = 0;
        const select = () => {
            const element: T = getElement();
            if (element && check(element)) {
                resolve(element);
            } else {
                attempts++;
                if (attempts < MAX_ATTEMPTS) {
                    setTimeout(select, RETRY_DELAY);
                } else {
                    resolve(element);
                }
            }
        };
        select();
    });
};

getPromisableElement(
    () => window.HomeAssistantSecretTaps,
    (module: object) => !!module
).then((module) => {
    if (!module) {
        throw Error(`${NAMESPACE}: you need to add the plugin as a frontend > extra_module_url module.\nCheck the documentation: https://github.com/elchininet/home-assistant-secret-taps#installation`);
    }
});

declare global {
    interface Window {
        HomeAssistantSecretTaps: object;
    }
}