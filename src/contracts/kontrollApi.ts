import { Checkpoint } from './checkpointApi';
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
    instrumenter: { id: number }[];
}

export interface Skjema {
    id: number;
    area: string;
    omrade: string;
    kommentar: string;
    kontroll: { id: number };
}

export interface ExtendedSkjema {
    id: number;
    area: string;
    omrade: string;
    kommentar: string;
    kontroll: { id: number };
    checklists: Checklist[];
}

export interface Checklist {
    id: number;
    checkpoint: Checkpoint;
    aktuell: boolean;
    skjema: { id: number };
}
