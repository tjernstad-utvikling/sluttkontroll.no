export interface Klient {
    id: number;
    name: string;
    objekts: Array<{ id: number; name: string }>;
}

export interface Kontroll {
    id: number;
    Objekt: {
        id: number;
        name: string;
        klient: {
            id: number;
            name: string;
        };
    };
    name: string;
    kommentar: string;
    Skjemaer: Array<Skjema>;
}

export interface Skjema {
    id: number;
    area: string;
    omrade: string;
    kommentar: string;
    checklists: Array<Checklist>;
    measurements: unknown;
}

export interface Checklist {
    id: number;
    checkpoint: {
        id: number;
        prosedyreNr: string;
        prosedyre: string;
        tekst: string;
        tiltak: string | null;
    };
    aktuell: boolean;
}

export interface Measurement {
    id: number;
    Skjema: {
        id: number;
    };
    element: string;
    enhet: string;
    maks: string;
    min: string;
    pol: number | null;
    resultat: string;
    type: string;
}

export interface Avvik {
    id: number;
    beskrivelse: string;
    avvikBilder: Array<AvvikBilde>;
    checklist: {
        id: number;
    };
    kommentar: string;
    laderModus: string | null;
    registrertDato: string;
    status: string | null;
}

export interface AvvikBilde {
    id: number;
    image: string;
    width: number;
    height: number;
}

export interface MeasurementType {
    id: number;
    enhet: string;
    hasPol: boolean;
    longName: string;
    shortName: string;
}
