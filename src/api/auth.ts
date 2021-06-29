import { SlkUser } from '../contracts/user';
import { StorageKeys } from '../contracts/keys';
import sluttkontrollApi from './sluttkontroll';

export const getLogin = async (
    email: string,
    password: string
): Promise<{ status: number; token?: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/login_check', {
            username: email,
            password: password
        });
        if (status === 200) {
            localStorage.setItem(StorageKeys.token, data.token);
            localStorage.setItem(StorageKeys.refreshToken, data.refresh_token);

            return {
                status,
                token: data.token
            };
        }
        return {
            status
        };
    } catch (error) {
        return {
            status: error.response.status
        };
    }
};
interface returnValue {
    status: number;
    user?: SlkUser;
}
export const getCurrentUser = async (): Promise<returnValue> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/user/me');
        if (status === 200) {
            localStorage.setItem(
                StorageKeys.currentUser,
                JSON.stringify(data.user)
            );

            return {
                status,
                user: data.user
            };
        }
        return {
            status
        };
    } catch (error) {
        return {
            status: error.response.status
        };
    }
};
