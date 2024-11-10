import { getPromisableResult } from 'get-promisable-result';
import { NAMESPACE } from '@constants';

getPromisableResult(
    () => window.HomeAssistantSecretTaps,
    (module: object) => !!module,
    {
        retries: 100,
        delay: 50,
        shouldReject: false
    }
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