export interface SkjemaerViewParams {
    kontrollId: string;
}
export interface MeasurementsViewParams {
    kontrollId: string;
    skjemaId?: string;
}
export interface SjekklisterViewParams {
    skjemaId: string;
}
export interface KontrollKlientViewParams {
    klientId: string;
}
export interface KontrollObjectViewParams {
    klientId: string;
    objectId: string;
}
