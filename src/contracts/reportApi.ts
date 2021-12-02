import { Sertifikat } from './certificateApi';

export interface ReportSetting {
    id: number;
    reportTitle: string;
    reportSite: string;
    reportDate: string;
    reportUserName: string;
    selectedSkjemaer: number[];
    modules: ReportModules[];
}

export enum ReportModules {
    frontPage = 'FrontPage',
    infoPage = 'InfoPage',
    statementPage = 'StatementPage',
    controlModule = 'controlModule',
    skjemaPage = 'skjemaPage',
    measurementPage = 'measurementPage',
    inlineMeasurementModule = 'inlineMeasurementModule'
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
