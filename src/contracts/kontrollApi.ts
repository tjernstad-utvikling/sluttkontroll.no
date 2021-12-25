import { RapportEgenskaper } from './reportApi';

export interface Klient {
    id: number;
    name: string;
    locations: Location[];
}

export interface Location {
    id: number;
    name: string;
    locationImage?: LocationImage | null | undefined;
}

export interface LocationImage {
    id: number;
    url: string;
    width: number;
    height: number;
}

export interface Kontroll {
    id: number;
    name: string;
    kommentar: string;
    done: boolean;
    completedDate: string | null;
    location: {
        id: number;
        klient: {
            id: number;
        };
    };
    user: {
        id: number;
    };
    avvikUtbedrere: { id: number }[];
}
export interface ReportKontroll {
    id: number;
    name: string;
    kommentar: string;
    done: boolean;
    completedDate: string | null;
    location: {
        id: number;
        klient: {
            id: number;
        };
    };
    user: {
        id: number;
    };
    avvikUtbedrere: { id: number }[];
    rapportEgenskaper: RapportEgenskaper | null;
}

export interface Skjema {
    id: number;
    area: string;
    omrade: string;
    kommentar: string;
    kontroll: { id: number };
}

export interface Checklist {
    id: number;
    checkpoint: {
        id: number;
        prosedyreNr: string;
        prosedyre: string;
        tiltak: null;
        tekst: string;
        gruppe: string;
    };
    aktuell: boolean;
    skjema: { id: number };
}
