export interface Sertifikat {
    id: number;
    number: string;
    type: SertifikatType;
    validTo: string;
}

export interface SertifikatType {
    id: number;
    logoBase64: string;
    name: string;
}
