export const BASE_URL = 'http://host.docker.internal:8123';
export const CONFIG_PATH = 'local/secret-taps.yaml*';

export const CONFIG_FILES = {
    BASIC: 'basic',
    NON_MATCHING_USERS: 'non-matching-users',
    MATCHING_USERS: 'matching-users',
    NOT_ENABLED: 'not-enabled',
    NOTIFICATIONS_DISABLED: 'notifications-disabled',
    NOTIFICATIONS_ENABLED: 'notifications-enabled',
    DEBUG: 'debug'
};

export const SELECTORS = {
    LAUNCH_SCREEN: '#ha-launch-screen',
    HOME_ASSISTANT: 'home-assistant',
    HOME_ASSISTANT_MAIN: 'home-assistant-main',
    HA_DRAWER: 'ha-drawer',
    HUI_VIEW: 'hui-view',
    MY_SWITCH: '#basic-switch',
    MORE_INFO_DIALOG: 'ha-dialog',
    DIALOG_HEADER_TITLE: 'ha-dialog-header span[slot="title"]',
    SIDEBAR: 'ha-sidebar',
    TOAST: '.mdc-snackbar__label'
};