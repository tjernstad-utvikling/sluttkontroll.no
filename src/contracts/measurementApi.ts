export interface Measurement {
    id: number;
    Skjema: {
        id: number;
        kontroll: {
            id: number;
        };
    };
    element: string;
    enhet: string;
    maks: string;
    min: string;
    pol: number | null;
    resultat: string;
    type: string;
}

export interface MeasurementType {
    id: number;
    enhet: string;
    hasPol: boolean;
    longName: string;
    shortName: string;
}
