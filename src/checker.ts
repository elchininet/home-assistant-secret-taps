import { NAMESPACE } from '@constants';
import { getPromisableElement } from '@utilities';

getPromisableElement(
    () => window.HomeAssistantSecretTaps,
    (module: object) => !!module
).then((module) => {
    if (!module) {
        throw Error(`${NAMESPACE}: you need to add the plugin as a frontend > extra_module_url module.\nCheck the documentation: https://github.com/elchininet/home-assistant-secret-taps#installation`);
    }
});