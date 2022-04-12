import { Checkpoint } from '../contracts/checkpointApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const updateCheckpoints = async (
    checkpointId: number,
    prosedyre: string,
    prosedyreNr: string,
    tekst: string,
    gruppe: string
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/checkpoint/${checkpointId}`,
            {
                prosedyre,
                prosedyreNr,
                tekst,
                gruppe
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
export const newCheckpoints = async (
    prosedyre: string,
    prosedyreNr: string,
    tekst: string,
    gruppe: string
): Promise<{
    status: number;
    checkpoint?: Checkpoint;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(`/checkpoint/`, {
            prosedyre,
            prosedyreNr,
            tekst,
            gruppe
        });
        return { status, ...data };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw new Error(error);
    }
};

export const checkpointGroupOptions = [
    { value: 'Installasjon', label: 'Installasjon' },
    { value: 'Målinger', label: 'Målinger' },
    { value: 'Tavler', label: 'Tavler' },
    { value: 'Annet', label: 'Annet' }
];
