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
