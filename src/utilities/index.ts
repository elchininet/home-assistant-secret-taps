import jsYaml from 'js-yaml';
import {
    Config,
    User,
    Profile,
    Secret,
    ServiceSecret,
    MoreInfoSecret,
    NavigateSecret,
    ToggleMenuSecret,
    ServiceType
} from '@types';
import {
    NAMESPACE,
    CONFIG_PATH,
    MAX_ATTEMPTS,
    RETRY_DELAY,
    TYPEOF,
    DOMAIN_ENTITY_REGEXP
} from '@constants';
import { version } from '../../package.json';

export const logVersionToConsole = () => {
    console.info(
        `%c👆👆👆 ${NAMESPACE.toUpperCase()} 👆👆👆%cv${version}`,
        'font-size: 16px; background: #00acfb; color: #FFFFFF; padding: 5px 20px',
        'font-size: 16px; background: #666666; color: #FFFFFF; padding: 5px 20px'
    );
};

export const randomId = (): string => Math.random().toString(16).slice(2);

export const fetchConfig = async (): Promise<Config> => {
    const errorNotFound = `${NAMESPACE}: YAML config file not found.`;
    const errorSuffix = 'Make sure you have valid config in /config/www/secret-gestures.yaml file.';
    return new Promise<Config>((resolve) => {
        fetch(`${CONFIG_PATH}?hash=${randomId()}`)
            .then((response: Response) => {
                if (response.ok) {
                    response
                        .text()
                        .then((yaml) => {
                            return jsYaml.load(yaml);
                        })
                        .then((config: Config) => {
                            resolve(config);
                        })
                        .catch((error: Error) => {
                            throw Error(`${NAMESPACE}: ${error?.message || error}`);
                        });
                } else {
                    throw Error(`${errorNotFound}\n${errorSuffix}`);
                }
            })
            .catch(() => {
                throw Error(`${errorNotFound}\n${errorSuffix}`);
            });
    });
};

export const getPromisableElement = <T>(
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
                // The else clause is an edge case that should not happen
                // Very hard to reproduce so it cannot be covered
                /* istanbul ignore else */
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

const toArray = (value: string | string[]): string[] => {
    if (Array.isArray(value)) {
        return value.map((v: string) => v.toLocaleLowerCase());
    }
    return [
        value.toLocaleLowerCase()
    ];
};

export const getSecrets = (config: Config, user: User): Secret[] => {

    const isAdmin = user.is_admin;
    const isOwner = user.is_owner;
    const userName = user.name.toLocaleLowerCase();

    const matchedProfiles = config.profiles.filter((profile: Profile): boolean => {

        const matchIsAdmin = typeof profile.admin === TYPEOF.UNDEFINED || profile.admin === isAdmin;
        const matchIsOwner = typeof profile.owner === TYPEOF.UNDEFINED || profile.owner === isOwner;
        const matchUserName = typeof profile.user === TYPEOF.UNDEFINED || toArray(profile.user).includes(userName);

        return matchIsAdmin && matchIsOwner && matchUserName;

    });

    return matchedProfiles.flatMap((profile: Profile) => profile.secrets);

};

export const isServiceSecret = (secret: Secret): secret is ServiceSecret => {
    return (
        secret.action === ServiceType.CALL_SERVICE &&
        'service' in secret &&
        DOMAIN_ENTITY_REGEXP.test(secret.service)
    );
};

export const isMoreInfoSecret = (secret: Secret): secret is MoreInfoSecret => {
    return (
        secret.action === ServiceType.MORE_INFO &&
        !!secret.entity_id
    );
};

export const isNavigateSecret = (secret: Secret): secret is NavigateSecret => {
    return (
        secret.action === ServiceType.NAVIGATE &&
        !!secret.navigation_path
    );
};

export const isToggleMenuSecret = (secret: Secret): secret is ToggleMenuSecret => {
    return secret.action === ServiceType.TOGGLE_MENU;
};

export const compareArrays = <T>(arrayA: T[], arrayB: T[]): boolean => {
    const length = arrayA.length;
    if (arrayB.length !== length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (arrayA[i] !== arrayB[i]) {
            return false;
        }
    }
    return true;
};