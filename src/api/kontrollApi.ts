import {
    Checklist,
    Klient,
    Kontroll,
    Location,
    RapportEgenskaper,
    ReportKontroll,
    Skjema
} from '../contracts/kontrollApi';

import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getClients = async (): Promise<{
    status: number;
    klienter: Array<Klient>;
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

export const getKontroller = async (): Promise<{
    status: number;
    kontroller: Array<Kontroll>;
    skjemaer: Array<Skjema>;
    checklists: Array<Checklist>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            '/kontroll/current-user'
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `/kontroll/${kontrollId}/report-data`
        );

        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};

export const saveKontrollReportData = async (
    kontrollId: number,
    reportProperties: RapportEgenskaper
): Promise<{
    status: number;
    kontroll: ReportKontroll | undefined;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/report/properties/${kontrollId}`,
            {
                ...reportProperties,
                rapportUser: reportProperties.rapportUser?.id,
                sertifikater: reportProperties.sertifikater.map((s) => {
                    return {
                        id: s.id
                    };
                })
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, kontroll: undefined };
        }
        throw new Error(error);
    }
};
export const toggleKontrollStatus = async (
    kontrollId: number
): Promise<number> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `/kontroll/status/${kontrollId}`
        );
        if (status === 204) {
            return status;
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `/kontroll/klient/${klientId}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `/kontroll/location/${objektId}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `/kontroll/${kontroll.id}`,
            { ...kontroll }
        );
        if (status === 204) {
            return { status };
        }
        throw new Error('not 204');
    } catch (error: any) {
        throw new Error(error);
    }
};

export const moveKontrollApi = async (
    kontroll: Kontroll,
    locationId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `kontroll/move/${kontroll.id}/to/${locationId}`
        );

        return { status };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
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
            `/kontroll/${location.id}/${user.id}`,
            { name, avvikUtbedrere }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `/skjema/${kontrollId}`,
            { area, omrade, checkpointIds }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `/checklist/${skjemaId}`,
            { checkpointIds }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};
export const toggleAktuellStatusChecklist = async (
    checklistId: number,
    aktuell: boolean
): Promise<{
    status: number;
    checklists: Array<Checklist>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/checklist/aktuell/${checklistId}/${aktuell ? 1 : 0}`
        );
        if (status === 204) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
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
            `checklist/skjema/${skjema.id}`
        );
        return { status, ...data };
    } catch (error: any) {
        throw new Error(error);
    }
};
export const deleteSkjemaById = async (
    skjemaId: number
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.delete(`skjema/${skjemaId}`);

        return { status, message: '' };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const updateSkjemaApi = async (
    skjema: Skjema
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`skjema/${skjema.id}`, {
            area: skjema.area,
            omrade: skjema.omrade
        });

        return { status, message: '' };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const moveSkjemaApi = async (
    skjema: Skjema,
    kontrollId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `skjema/move/${skjema.id}/to/${kontrollId}`
        );

        return { status };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};
