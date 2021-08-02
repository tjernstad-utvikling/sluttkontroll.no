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
    completedDate: string | null;
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
export interface ReportKontroll {
    id: number;
    name: string;
    kommentar: string;
    done: boolean;
    completedDate: string | null;
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
    rapportEgenskaper: RapportEgenskaper | null;
}

export interface RapportEgenskaper {
    adresse: string;
    id: number;
    kontaktEpost: string;
    kontaktTelefon: string;
    kontaktperson: string;
    kontrollerEpost: string;
    kontrollerTelefon: string;
    kontrollsted: string;
    oppdragsgiver: string;
    postnr: string;
    poststed: string;
    rapportUser: { email: string; id: number; name: string; phone: string };
    sertifikater: [];
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
