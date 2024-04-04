export const BASE_URL = 'http://host.docker.internal:8123';
export const MAXIMUM_RETRIES = 10;
export const RETRY_DELAY = 200;
export const CONFIG_PATH = 'local/secret-taps.yaml*';

export const CONFIG_FILES = {
    BASIC: 'basic',
    NON_MATCHING_USERS: 'non-matching-users',
    MATCHING_USERS: 'matching-users',
    NOT_ENABLED: 'not-enabled',
    NOTIFICATIONS_DISABLED: 'notifications-disabled',
    NOTIFICATIONS_ENABLED: 'notifications-enabled'
};

export const SELECTORS = {
    HUI_VIEW: 'hui-view',
    MY_SWITCH: '#basic-switch',
    MORE_INFO_DIALOG: 'ha-dialog',
    DIALOG_HEADER_TITLE: 'ha-dialog-header span[slot="title"]',
    SIDEBAR: 'ha-sidebar',
    TOAST: 'ha-toast'
};