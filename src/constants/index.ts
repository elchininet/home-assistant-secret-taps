export const NAMESPACE = 'home-assistant-secret-taps';
export const CONFIG_PATH = '/local/secret-taps.yaml';
export const MAX_ATTEMPTS = 100;
export const RETRY_DELAY = 50;

export const DEFAULT_THRESHOLD = 1000;

export enum TYPEOF {
    BOOLEAN = 'boolean',
    UNDEFINED = 'undefined'
}

export enum GESTURES {
    TAP = 'tap',
    DOUBLE_TAP = 'double-tap',
    TRIPLE_TAP = 'triple-tap'
}

export enum EVENT {
    HASS_MORE_INFO = 'hass-more-info',
    HASS_TOGGLE_MENU = 'hass-toggle-menu',
    HASS_NOTIFICATION = 'hass-notification',
    LOCATION_CHANGED = 'location-changed'
}

export const DOMAIN_ENTITY_REGEXP = /^([a-z_]+)\.([\w-]+)$/;