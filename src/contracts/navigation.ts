export interface SkjemaerViewParams {
    kontrollId: string;
}
export interface MeasurementsViewParams {
    kontrollId: string;
    skjemaId?: string;
}
export interface AttachmentsViewParams {
    kontrollId: string;
}
export interface AvvikViewParams {
    kontrollId: string;
    skjemaId?: string;
    objectId: string;
    checklistId?: string;
}
export interface AvvikPageViewParams {
    avvikId: string;
    kontrollId: string;
    skjemaId?: string;
    objectId: string;
    checklistId?: string;
}
export interface AvvikNewViewParams {
    checklistId: string;
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
export interface KontrollReportStatementViewParams {
    kontrollId: string;
}
export interface InstrumentCalibrationViewParams {
    instrumentId: string;
}
export interface EditUserViewParams {
    userId: string;
}
export interface AdminTemplateEditViewParams {
    templateId: string;
}
export interface AdminFormsTemplateEditViewParams {
    templateId: string;
}
export interface AdminCheckpointEditViewParams {
    checkpointId: string;
}
export interface PasswordResetViewParams {
    token?: string;
}

/**
 * External routes
 */
export interface ExternalAvvikPageViewParams {
    avvikId: string;
}
export interface ExternalAvvikListViewParams {
    clientId?: string;
    locationId?: string;
}
