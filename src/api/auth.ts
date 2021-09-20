import { StorageKeys } from '../contracts/keys';
import { User } from '../contracts/userApi';
import sluttkontrollApi from './sluttkontroll';

export const getLogin = async (
    email: string,
    password: string
): Promise<{ status: number; token?: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/auth/login', {
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
    } catch (error: any) {
        return {
            status: error.response.status
        };
    }
};
interface returnValue {
    status: number;
    user?: User;
}
export const getCurrentUser = async (): Promise<returnValue> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/user/me');
        console.log({ data });
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
    } catch (error: any) {
        return {
            status: error.response.status
        };
    }
};
