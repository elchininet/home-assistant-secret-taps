import {
    HAQuerySelector,
    HAQuerySelectorEvent,
    OnListenDetail
} from 'home-assistant-query-selector';
import {
    HomeAssistant,
    HassObject,
    Config,
    Secret,
    ServiceSecret,
    MoreInfoSecret,
    NavigateSecret
} from 'types';
import {
    NAMESPACE,
    DEFAULT_THRESHOLD,
    GESTURES,
    EVENT,
    TYPEOF,
    DOMAIN_ENTITY_REGEXP
} from '@constants';
import {
    logVersionToConsole,
    fetchConfig,
    getPromisableElement,
    getSecrets,
    isServiceSecret,
    isMoreInfoSecret,
    isNavigateSecret,
    isToggleMenuSecret,
    compareArrays
} from '@utilities';
import 'hammerjs';

class HomeAssistantSecretTaps {

    constructor() {

        const selector = new HAQuerySelector();

        selector.addEventListener(
            HAQuerySelectorEvent.ON_LISTEN,
            (event: CustomEvent<OnListenDetail>) => {

                Promise.all([
                    fetchConfig(),
                    event.detail.HOME_ASSISTANT.element,
                    event.detail.HOME_ASSISTANT_MAIN.element
                ]).then(([config, homeAssistant, homeAssistantMain]) => {

                    if (config.enabled) {

                        this._config = config;
                        this._threshold = config.threshold || DEFAULT_THRESHOLD;
                        this._ha = homeAssistant as HomeAssistant;
                        this._main = homeAssistantMain as HTMLElement;

                        this._log('configuration loaded, printing configuration...');
                        this._log(this._config);

                        getPromisableElement(
                            () => this._ha.hass,
                            (hass: HassObject): boolean => !!(
                                hass?.callService &&
                                hass.user
                            )
                        )
                            .then((hass: HassObject) => {
                                this._secrets = getSecrets(this._config, hass.user);
                                this._log(`secrets queried for ${hass.user.name}, printing secrets...`);
                                this._log(this._secrets);
                                this._start();
                            });

                    }

                });

            },
            {
                once: true
            }
        );

        selector.listen();

    }

    private _config: Config;
    private _threshold: number;
    private _ha: HomeAssistant;
    private _main: HTMLElement;
    private _secrets: Secret[];
    private _taps: HammerManager;
    private _stack: string[] | null;
    private _eventTimeoutId: number;

    private _log(message: string | object): void {
        if (this._config.debug) {
            const logMessage = typeof message === TYPEOF.OBJECT
                ? JSON.stringify(message, null, 4)
                : message;
            console.log(`${NAMESPACE}: ${logMessage}`);
        }
    }

    private _callService(secret: ServiceSecret): void {
        const { service, data = {} } = secret;
        const matches = service.match(DOMAIN_ENTITY_REGEXP);
        this._ha.hass.callService(
            matches[1],
            matches[2],
            data
        );
    }

    private _openMoreInfo(secret: MoreInfoSecret): void {
        this._ha.dispatchEvent(
            new CustomEvent(
                EVENT.HASS_MORE_INFO,
                {
                    detail: {
                        entityId: secret.entity_id
                    }
                }
            )
        );
    }

    private _navigate(secret: NavigateSecret): void {
        const { navigation_path, navigation_replace = false } = secret;
        if (navigation_replace) {
            window.history.replaceState(
                window.history.state?.root
                    ? { root: true }
                    : null,
                '',
                navigation_path
            );
        } else {
            window.history.pushState(
                null,
                '',
                navigation_path
            );
        }
        window.dispatchEvent(
            new CustomEvent(
                EVENT.LOCATION_CHANGED,
                {
                    detail: {
                        replace: navigation_replace
                    }
                }
            )
        );
    }

    private _toggleMenu() {
        this._main.dispatchEvent(
            new Event(
                EVENT.HASS_TOGGLE_MENU
            )
        );
    }

    private _showNotification(message: string): void {
        this._ha.dispatchEvent(
            new CustomEvent(
                EVENT.HASS_NOTIFICATION,
                {
                    detail: {
                        message,
                        dismissable: true
                    }
                }
            )
        );
    }

    private _execute(secret: Secret): void {

        let executed = false;

        if (isServiceSecret(secret)) {

            this._callService(secret);
            executed = true;

        } else if (isMoreInfoSecret(secret)) {

            this._openMoreInfo(secret);
            executed = true;

        } else if (isNavigateSecret(secret)) {

            this._navigate(secret);
            executed = true;

        } else if (isToggleMenuSecret(secret)) {

            this._toggleMenu();
            executed = true;

        }

        if (this._config.notification) {

            this._log(
                executed
                    ? 'secret executed!'
                    : 'secret NOT executed! secret with errors'
            );

            this._log(secret);

            this._showNotification(
                executed
                    ? 'secret taps successfully executed!'
                    : 'secret taps failed! Review your secret config!'
            );

        }

    }

    private _processTaps(): void {

        this._log('checking if there is a scret with the previous event stack');

        const secret = this._secrets.find((secret: Secret): boolean => {
            return compareArrays(this._stack, secret.taps);
        });

        if (secret) {
            this._log('secret found, executing secret');
            this._execute(secret);
        }

    }

    private _trackTap(event: HammerInput): void {

        this._log(`event ${event.type} fired`);

        window.clearTimeout(this._eventTimeoutId);

        this._stack = this._stack || [];

        this._stack.push(event.type);

        this._log('printig event stack...');
        this._log(this._stack.join(' » '));

        this._eventTimeoutId = window.setTimeout(() => {

            this._processTaps();

            this._stack = null;

        }, this._threshold);

    }

    private _start(): void {

        delete Hammer.defaults.cssProps;

        this._taps = new Hammer.Manager(this._ha);

        const commonProps = {
            threshold: 10,
            posThreshold: 15
        };

        const tripleTap = new Hammer.Tap({
            event: GESTURES.TRIPLE_TAP,
            taps: 3,
            ...commonProps
        });

        const doubleTap = new Hammer.Tap({
            event: GESTURES.DOUBLE_TAP,
            taps: 2,
            ...commonProps
        });

        const singleTap = new Hammer.Tap({
            event: GESTURES.TAP,
            ...commonProps
        });

        this._taps.add([
            tripleTap,
            doubleTap,
            singleTap
        ]);

        tripleTap.recognizeWith([doubleTap, singleTap]);
        doubleTap.recognizeWith(singleTap);

        doubleTap.requireFailure(tripleTap);
        singleTap.requireFailure([doubleTap, tripleTap]);

        this._taps.on(Object.values(GESTURES).join(' '), (event: HammerInput): void => {
            this._trackTap(event);
        });

    }

}

if (!window.HomeAssistantSecretTaps) {
    logVersionToConsole();
    window.HomeAssistantSecretTaps = new HomeAssistantSecretTaps();
}