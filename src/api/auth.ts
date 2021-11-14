import { StorageKeys } from '../contracts/keys';
import { User } from '../contracts/userApi';
import sluttkontrollApi from './sluttkontroll';

export const getLogin = async (
    email: string,
    password: string
): Promise<{ status: number; token?: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/auth/login', {
            email: email,
            password: password
        });
        if (status === 200) {
            localStorage.setItem(StorageKeys.token, data.accessToken.token);
            localStorage.setItem(StorageKeys.refreshToken, data.refreshToken);

            return {
                status,
                token: data.accessToken.token
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
    } catch (error: any) {
        return {
            status: error.response.status
        };
    }
};
export const postForgotEmail = async (
    email: string
): Promise<{ status: number }> => {
    try {
        const { status } = await sluttkontrollApi.post(
            '/auth/password-manager/send',
            { email }
        );

        return {
            status
        };
    } catch (error: any) {
        return {
            status: error.response.status
        };
    }
};

export const postNewEmail = async (
    password: string,
    resetToken: string
): Promise<{ status: number }> => {
    try {
        const { status } = await sluttkontrollApi.post(
            '/auth/password-manager/reset',
            { password, resetToken }
        );

        return {
            status
        };
    } catch (error: any) {
        return {
            status: error.response.status
        };
    }
};

export const logoutAll = async (): Promise<{ status: number }> => {
    try {
        const { status } = await sluttkontrollApi.put('/auth/logout-all');

        return {
            status
        };
    } catch (error: any) {
        return {
            status: error.response.status
        };
    }
};
