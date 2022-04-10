import { Klient, Location } from '../contracts/kontrollApi';

import sluttkontrollApi from './sluttkontroll';

export const getClients = async (): Promise<{
    status: number;
    klienter: Klient[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/klient');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};

export const newClient = async (
    name: string
): Promise<{
    status: number;
    klient: Klient;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/klient/', {
            name
        });
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};

export const editClient = async (
    id: number,
    name: string
): Promise<{
    status: number;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`/klient/${id}`, {
            name
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};

export const newLocation = async (
    name: string,
    klient: Klient
): Promise<{
    status: number;
    location: Location;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/location/${klient.id}`,
            {
                name
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
export const editLocation = async (
    name: string,
    id: number
): Promise<{
    status: number;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`/location/${id}`, {
            name
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};
