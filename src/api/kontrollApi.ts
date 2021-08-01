import {
    Checklist,
    Klient,
    Kontroll,
    Location,
    ReportKontroll,
    Skjema
} from '../contracts/kontrollApi';

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

export const editClient = async (
    id: number,
    name: string
): Promise<{
    status: number;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`/v3/klient/${id}`, {
            name
        });
        if (status === 204) {
            return { status };
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
export const editLocation = async (
    name: string,
    id: number
): Promise<{
    status: number;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`/v3/objekt/${id}`, {
            name
        });
        if (status === 204) {
            return { status };
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
export const getKontrollReportData = async (
    kontrollId: number
): Promise<{
    status: number;
    kontroll: ReportKontroll;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/kontroll/${kontrollId}/report-data`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};

export const getKontrollerByKlient = async (
    klientId: number
): Promise<{
    status: number;
    kontroller: Array<Kontroll>;
    skjemaer: Array<Skjema>;
    checklists: Array<Checklist>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/kontroll/klient/${klientId}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};

export const getKontrollerByObjekt = async (
    objektId: number
): Promise<{
    status: number;
    kontroller: Array<Kontroll>;
    skjemaer: Array<Skjema>;
    checklists: Array<Checklist>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/kontroll/object/${objektId}`
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
export const editChecklist = async (
    checkpointIds: Array<number>,
    skjemaId: number
): Promise<{
    status: number;
    checklists: Array<Checklist>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/v3/checklist/${skjemaId}`,
            { checkpointIds }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};

export const getChecklistsBySkjema = async (
    skjema: Skjema
): Promise<{
    status: number;
    checklists: Checklist[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `v3/checklist/skjema/${skjema.id}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
