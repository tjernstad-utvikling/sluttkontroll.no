export interface User {
    id: number;
    email: string;
    roles: Array<Roles>;
    name: string;
    phone: string;
    sertifikater: Sertifikat[];
}

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

export enum Roles {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_EDIT_USER = 'ROLE_EDIT_USER',
    ROLE_EDIT_ROLES = 'ROLE_EDIT_ROLES',
    ROLE_USER = 'ROLE_USER',
    ROLE_DELETE = 'ROLE_DELETE'
}
