import { Forms } from '../contracts/formsApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getFormsByCurrentUser = async (): Promise<{
    status: number;
    forms?: Forms[];
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/forms');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};

export const getFormsDocument = async (): Promise<{
    status: number;
    data: Blob;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/download/forms-document/${4}`,
            {
                responseType: 'blob'
            }
        );

        return { status, data: data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
