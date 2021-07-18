export interface Klient {
    id: number;
    name: string;
    objekts: Array<Location>;
}

export interface Location {
    id: number;
    name: string;
}

export interface Kontroll {
    id: number;
    name: string;
    kommentar: string;
    done: boolean;
    Objekt: {
        id: number;
        klient: {
            id: number;
        };
    };
    user: {
        id: number;
    };
    avvikUtbedrere: Array<{ id: number }>;
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
