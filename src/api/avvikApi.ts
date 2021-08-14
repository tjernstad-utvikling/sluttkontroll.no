import { Avvik } from '../contracts/avvikApi';
import { User } from '../contracts/userApi';
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

export const updateAvvikById = async (
    avvik: Avvik
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`/v3/avvik/${avvik.id}`, {
            beskrivelse: avvik.beskrivelse,
            kommentar: avvik.kommentar,
            utbedrer: avvik.utbedrer
        });
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

export const setUtbedrereApi = async (
    avvikList: Array<number>,
    utbedrer: Array<User>
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.post(
            '/v3/avvik/set-utbedrere',
            {
                avvikList,
                utbedrer
            }
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

export const openAvvikApi = async (
    avvikId: number
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `/v3/avvik/open/${avvikId}`
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
export const closeAvvikApi = async (
    avvikList: Array<number>,
    kommentar: string
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.post('/v3/avvik/close', {
            avvikList,
            kommentar
        });
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

export const deleteImage = async (
    imageId: number
): Promise<{ status: number; message: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.delete(
            `/v3/avvik/bilder/${imageId}`
        );

        return { status, ...data };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
