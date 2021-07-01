import { StorageKeys } from '../contracts/keys';
import axios from 'axios';

let isRefreshing = false;

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

instance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem(StorageKeys.token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Return any error which is not due to authentication back to the calling service
        if (error.response.status === 401) {
            // Logout user if token refresh didn't work or user is disabled

            if (error.config.url === '/token/refresh') {
                // RootNavigation.navigate('Logg ut', {});
                error.config = null;
                return Promise.reject(error);
            } else {
                if (!isRefreshing) {
                    isRefreshing = true;
                    // Try request again with new token
                    try {
                        const { token } = await refreshLoginToken();
                        // New request with new token
                        const config = error.config;
                        config.headers.Authorization = `Bearer ${token}`;
                        return new Promise((resolve, reject) => {
                            axios
                                .request(config)
                                .then((response) => {
                                    isRefreshing = false;
                                    resolve(response);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        });
                    } catch (Error) {
                        Promise.reject(Error);
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;

const refreshLoginToken = async (): Promise<{
    token: string;
}> => {
    try {
        const refresh_token = localStorage.getItem(StorageKeys.refreshToken);
        const { status, data } = await instance.post('/token/refresh', {
            refresh_token
        });

        if (status === 200) {
            localStorage.setItem(StorageKeys.token, data.token);
            localStorage.setItem(StorageKeys.refreshToken, data.refresh_token);
            return {
                token: data.token
            };
        }
        throw new Error('');
    } catch (error) {
        throw new Error('');
    }
};