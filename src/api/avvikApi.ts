import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getImageFile = async (
    name: string
): Promise<{ status: number; data: Blob }> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/avvik/bilder/${name}`,
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

export const getAvvikReport = async (
    kontrollId: number,
    avvikIds: number[]
): Promise<{ status: number; data: Blob }> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            '/download/avvik-report',
            {
                kontrollId,
                avvikIds
            },
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
