export interface SkjemaerViewParams {
    kontrollId: string;
}
export interface MeasurementsViewParams {
    kontrollId: string;
    skjemaId?: string;
}
export interface AvvikViewParams {
    kontrollId: string;
    skjemaId?: string;
    checklistId?: string;
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
export interface KontrollReportViewParams {
    klientId: string;
    objectId: string;
    kontrollId: string;
}
