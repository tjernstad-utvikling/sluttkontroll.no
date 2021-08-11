import { Avvik } from '../contracts/avvikApi';
import sluttkontrollApi from './sluttkontroll';

export const getAvvikByKontrollList = async (
    ids: Array<number>
): Promise<{
    status: number;
    avvik: Array<Avvik>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/avvik/kontroll-list/${ids.join()}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
export const deleteAvvikById = async (
    avvikId: number
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.delete(
            `/v3/avvik/${avvikId}`
        );
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 200');
    } catch (error) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const getImageFile = async (
    nameOrId: number | string
): Promise<{ status: number; data: Blob }> => {
    try {
        console.log('getImageOnServer start');
        const { status, data } = await sluttkontrollApi.get(
            `/v3/avvik/bilder/${nameOrId}`,
            {
                responseType: 'blob'
            }
        );

        return { status, data: data };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
