import {
    Checklist,
    Klient,
    Kontroll,
    Location,
    Skjema
} from '../contracts/kontrollApi';

import { Checkpoint } from '../contracts/checkpointApi';
import { User } from '../contracts/userApi';
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
    name: string,
    avvikUtbedrere: Array<User>,
    location: Location,
    user: User
): Promise<{
    status: number;
    kontroll: Kontroll;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/v3/kontroll/${location.id}/${user.id}`,
            { name, avvikUtbedrere }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
export const newSkjema = async (
    area: string,
    omrade: string,
    checkpointIds: Array<number>,
    kontrollId: number
): Promise<{
    status: number;
    skjema: Skjema;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/v3/skjema/${kontrollId}`,
            { area, omrade, checkpoints: checkpointIds }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
