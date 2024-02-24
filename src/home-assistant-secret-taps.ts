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
    DEFAULT_THRESHOLD,
    GESTURES,
    EVENT,
    DOMAIN_ENTITY_REGEXP
} from '@constants';
import {
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

                        getPromisableElement(
                            () => this._ha.hass,
                            (hass: HassObject): boolean => !!(
                                hass?.callService &&
                                hass.user
                            )
                        )
                            .then((hass: HassObject) => {
                                this._secrets = getSecrets(this._config, hass.user);
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

    private _execute(secret: Secret): void {

        if (isServiceSecret(secret)) {
            this._callService(secret);
            return;
        }

        if (isMoreInfoSecret(secret)) {
            this._openMoreInfo(secret);
            return;
        }

        if (isNavigateSecret(secret)) {
            this._navigate(secret);
            return;
        }

        if (isToggleMenuSecret(secret)) {
            this._toggleMenu();
        }

    }

    private _processTaps(): void {

        const secret = this._secrets.find((secret: Secret): boolean => {
            return compareArrays(this._stack, secret.taps);
        });

        if (secret) {
            this._execute(secret);
        }

    }

    private _trackTap(event: HammerInput): void {

        window.clearTimeout(this._eventTimeoutId);

        this._stack = this._stack || [];

        this._stack.push(event.type);

        this._eventTimeoutId = window.setTimeout(() => {

            this._processTaps();

            this._stack = null;

        }, this._threshold);

    }

    private _start(): void {

        delete Hammer.defaults.cssProps;

        this._taps = new Hammer.Manager(this._ha);

        const tripleTap = new Hammer.Tap({
            event: GESTURES.TRIPLE_TAP,
            taps: 3
        });

        const doubleTap = new Hammer.Tap({
            event: GESTURES.DOUBLE_TAP,
            taps: 2
        });

        const singleTap = new Hammer.Tap({
            event: GESTURES.TAP
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
    //logVersionToConsole();
    window.HomeAssistantSecretTaps = new HomeAssistantSecretTaps();
}