import { Sertifikat } from './certificateApi';

export interface ReportSetting {
    id: number;
    reportTitle: string;
    reportSite: string;
    reportDate: string;
    selectedSkjemaer: number[];
    selectedAttachments: number[];
    modules: ReportModules[];
}

export enum ReportModules {
    frontPage = 'FrontPage',
    infoPage = 'InfoPage',
    clientModule = 'ClientModule',
    controllerModule = 'ControllerModule',
    infoModule = 'InfoModule',
    statementPage = 'StatementPage',
    statementModule = 'StatementModule',
    instrumentModule = 'InstrumentModule',
    controlModule = 'controlModule',
    skjemaPage = 'skjemaPage',
    measurementPage = 'measurementPage',
    inlineMeasurementModule = 'inlineMeasurementModule',
    attachmentModule = 'attachmentModule'
}

export interface RapportEgenskaper {
    adresse: string;
    id: number;
    kontaktEpost: string;
    kontaktTelefon: string;
    kontaktperson: string;
    kontrollsted: string;
    oppdragsgiver: string;
    postnr: string;
    poststed: string;
    rapportUser: RapportUser | null;
    sertifikater: Sertifikat[];
}

export interface RapportUser {
    email: string;
    id: number;
    name: string;
    phone: string;
}

export interface LocalImage {
    name: string;
    uri: string;
}
