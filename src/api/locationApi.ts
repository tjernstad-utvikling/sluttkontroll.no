import { LocationImage } from '../contracts/kontrollApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const uploadImageFile = async (
    locationId: number,
    image: File
): Promise<{
    status: number;
    locationImage?: LocationImage;
    message?: string;
}> => {
    try {
        const formData = new FormData();

        formData.append('image', image);

        const { status, data } = await sluttkontrollApi.post(
            `/location/add-image/${locationId}`,
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
        const { status, data } = await sluttkontrollApi.get(
            `/location/image/${name}`,
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
export const deleteImageFile = async (
    imageId: number
): Promise<{ status: number }> => {
    try {
        const { status } = await sluttkontrollApi.delete(
            `/location/image/${imageId}`
        );

        return { status };
    } catch (error: any) {
        errorHandler(error);
        return { status: error.response.status };
    }
};
