import { Avvik, AvvikBilde } from '../contracts/avvikApi';

import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getAvvikByKontrollList = async (
    ids: Array<number>
): Promise<{
    status: number;
    avvik: Array<Avvik>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/avvik/kontroll-list/${ids.join()}`
        );

        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
        const { status } = await sluttkontrollApi.delete(`/avvik/${avvikId}`);
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
        const { status } = await sluttkontrollApi.put(`/avvik/${avvik.id}`, {
            beskrivelse: avvik.beskrivelse,
            kommentar: avvik.kommentar,
            utbedrer: avvik.utbedrer
        });
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};
export const addAvvikApi = async (newAvvik: {
    beskrivelse: string;
    kommentar: string;
    utbedrer: User[] | null;
    checklistId: number;
}): Promise<{
    status: number;
    avvik: Avvik;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/avvik/${newAvvik.checklistId}`,
            {
                ...newAvvik
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
        const { status } = await sluttkontrollApi.post('/avvik/set-utbedrere', {
            avvikList,
            utbedrer
        });
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
        const { status } = await sluttkontrollApi.put(`/avvik/open/${avvikId}`);
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
        const { status } = await sluttkontrollApi.post('/avvik/close', {
            avvikList,
            kommentar
        });
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

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

export const deleteImage = async (
    imageId: number
): Promise<{ status: number; message: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.delete(
            `/avvik/bilder/${imageId}`
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
export const addImage = async (
    avvikId: number,
    image: File
): Promise<{ status: number; avvikBilde?: AvvikBilde; message?: string }> => {
    try {
        const formData = new FormData();

        formData.append('image', image);

        const { status, data } = await sluttkontrollApi.post(
            `/avvik/bilder/add/${avvikId}`,
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
