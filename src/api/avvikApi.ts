import { Avvik, AvvikBilde } from '../contracts/avvikApi';

import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getAvvikByKontrollList = async (
    ids: number[]
): Promise<{
    status: number;
    avvik: Avvik[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/avvik/kontroll-list/${ids.join()}`
        );

        return { status, ...data };
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
            utbedrer: avvik.utbedrer.map((u) => u.id)
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
export const moveAvvikApi = async (
    avvik: Avvik,
    checklistId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `/avvik/move/${avvik.id}/to/${checklistId}`
        );

        return { status };
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
                ...newAvvik,
                utbedrer: newAvvik.utbedrer?.map((u) => u.id)
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
    avvikList: number[],
    utbedrer: User[]
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
    avvikList: number[],
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
        if (status === 204 || status === 200) {
            return { status: 204, message: '' };
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
    images: File[]
): Promise<{
    status: number;
    avvikBilder?: AvvikBilde[];
    message?: string;
}> => {
    try {
        const formData = new FormData();

        images.forEach((file) => {
            formData.append('images', file);
        });

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
