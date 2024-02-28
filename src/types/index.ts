import Hammer from 'hammerjs';

export interface User {
    is_admin: boolean;
    is_owner: boolean;
    name: string;
}

export interface HassObject {
    callService: (domain: string, service: string, data: Record<string, unknown>) => void;
    user: User;
}

export interface HomeAssistant extends HTMLElement {
    hass: HassObject;
}

export enum ServiceType {
    CALL_SERVICE = 'call-service',
    MORE_INFO = 'more-info',
    NAVIGATE = 'navigate',
    TOGGLE_MENU = 'toggle-menu'
}

interface SecretBase {
    taps: string[];
}

export interface ServiceSecret extends SecretBase {
    action: `${ServiceType.CALL_SERVICE}`,
    service: string;
    data?: Record<string, unknown>;
}

export interface MoreInfoSecret extends SecretBase {
    action: `${ServiceType.MORE_INFO}`,
    entity_id: string;
}

export interface NavigateSecret extends SecretBase {
    action: `${ServiceType.NAVIGATE}`,
    navigation_path: string;
    navigation_replace?: boolean;
}

export interface ToggleMenuSecret extends SecretBase {
    action: `${ServiceType.TOGGLE_MENU}`
}

export type Secret =
    | ServiceSecret
    | MoreInfoSecret
    | NavigateSecret
    | ToggleMenuSecret;

export interface Profile {
    user?: string | string[];
    admin?: boolean;
    owner?: boolean;
    secrets: Secret[];
}

export interface Config {
    enabled: boolean;
    threshold?: number;
    notification?: boolean;
    debug?: boolean;
    profiles: Profile[];
}

declare global {
    interface Window {
        HomeAssistantSecretTaps: object;
        Hammer: typeof Hammer;
    }
}