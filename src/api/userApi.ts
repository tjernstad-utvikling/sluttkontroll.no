import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const updatePassword = async (
    password: string
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.post('/user/password', {
            password
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw new Error(error);
    }
};
