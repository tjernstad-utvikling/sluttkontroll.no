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
    maks: number;
    min: number;
    pol: number | null;
    resultat: number;
    type: string;
}
export interface NewFormMeasurement {
    element: string;
    enhet: string;
    maks: number;
    min: number;
    pol: number | null;
    resultat: number;
    type: string;
}

export interface MeasurementType {
    id: number;
    enhet: string;
    hasPol: boolean;
    longName: string;
    shortName: string;
}
