import { StatementImage } from '../contracts/imageApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const uploadImageFile = async (
    kontrollId: number,
    image: File
): Promise<{ status: number; image?: StatementImage; message?: string }> => {
    try {
        const formData = new FormData();

        formData.append('image', image);

        const { status, data } = await sluttkontrollApi.post(
            `/image/add/${kontrollId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return { status, ...data };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw new Error(error);
    }
};

export const getImageFile = async (
    name: string
): Promise<{ status: number; data: Blob }> => {
    try {
        const { status, data } = await sluttkontrollApi.get(`/image/${name}`, {
            responseType: 'blob'
        });

        return { status, data: data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
