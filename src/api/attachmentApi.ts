import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getAttachmentFile = async (
    name: string
): Promise<{ status: number; data: Blob }> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/attachment/${name}`,
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
