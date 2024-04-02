import { BASE_URL, MAXIMUM_RETRIES } from './constants';

export const haConfigRequest = async (file: string, retries = 0) => {
    return fetch(
        `${BASE_URL}/api/services/shell_command/copy_config`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HA_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                yaml: file
            })
        }
    ).then((response: Response) => {
        if (response.ok || retries >= MAXIMUM_RETRIES) {
            return response;
        }
        return haConfigRequest(file, retries + 1);
    });
};