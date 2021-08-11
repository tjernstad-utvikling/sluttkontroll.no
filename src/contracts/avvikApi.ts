export interface Avvik {
    id: number;
    beskrivelse: string;
    avvikBilder: Array<AvvikBilde>;
    checklist: {
        id: number;
        skjema: {
            id: number;
            kontroll: {
                id: number;
            };
        };
    };
    kommentar: string;
    registrertDato: string;
    status: string | null;
    oppdagetAv: {
        id: number;
    };
    utbedrer: {
        id: number;
    }[];
}

export interface AvvikBilde {
    id: number;
    image: string;
    width: number;
    height: number;
}
