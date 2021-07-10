import {
    Checklist,
    Klient,
    Kontroll,
    Location,
    Skjema
} from '../contracts/kontrollApi';

import sluttkontrollApi from './sluttkontroll';

export const getClients = async (): Promise<{
    status: number;
    klienter: Array<Klient>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/klient');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
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
        const { status, data } = await sluttkontrollApi.post('/v3/klient/', {
            name
        });
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
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
            `/v3/objekt/${klient.id}`,
            {
                name
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};

export const getKontroller = async (): Promise<{
    status: number;
    kontroller: Array<Kontroll>;
    skjemaer: Array<Skjema>;
    checklists: Array<Checklist>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            '/v3/kontroll/current-user'
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};

export const updateKontroll = async (
    kontroll: Kontroll
): Promise<{
    status: number;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `/v3/kontroll/${kontroll.id}`,
            { kontroll }
        );
        if (status === 204) {
            return { status };
        }
        throw new Error('not 204');
    } catch (error) {
        throw new Error(error);
    }
};

export const newKontroll = async (
    kontroll: Kontroll
): Promise<{
    status: number;
}> => {
    try {
        const { status } = await sluttkontrollApi.post(
            `/v3/kontroll/${location.id}/${user.id}`,
            { kontroll }
        );
        if (status === 200) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
