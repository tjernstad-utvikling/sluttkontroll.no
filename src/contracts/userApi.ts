import { Sertifikat } from './certificateApi';

export interface User {
    name: string;
    id: number;
    email: string;
    roles: Array<Roles>;
    phone: string;
    sertifikater: Sertifikat[];
}

export enum Roles {
    ROLE_KONTROLL = 'ROLE_KONTROLL',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_EDIT_USER = 'ROLE_EDIT_USER',
    ROLE_EDIT_ROLES = 'ROLE_EDIT_ROLES',
    ROLE_LUKKE_AVVIK = 'ROLE_LUKKE_AVVIK',
    ROLE_EDIT_AVVIK = 'ROLE_EDIT_AVVIK',
    ROLE_DELETE = 'ROLE_DELETE',
    ROLE_USER = 'ROLE_USER'
}

export const RolesDesc = {
    [Roles.ROLE_KONTROLL]: 'Kontrollør',
    [Roles.ROLE_ADMIN]: 'Administrator',
    [Roles.ROLE_EDIT_USER]: 'Rediger brukere',
    [Roles.ROLE_EDIT_ROLES]: 'Rediger brukerroller',
    [Roles.ROLE_LUKKE_AVVIK]: 'Lukke avvik',
    [Roles.ROLE_EDIT_AVVIK]: 'Rediger avvik',
    [Roles.ROLE_DELETE]: 'Slette skjema',
    [Roles.ROLE_USER]: 'Bruker'
};
export const RolesOptions = [
    { value: Roles.ROLE_KONTROLL, label: 'Kontrollør' },
    { value: Roles.ROLE_ADMIN, label: 'Administrator' },
    { value: Roles.ROLE_EDIT_USER, label: 'Rediger brukere' },
    { value: Roles.ROLE_EDIT_ROLES, label: 'Rediger brukerroller' },
    { value: Roles.ROLE_LUKKE_AVVIK, label: 'Lukke avvik' },
    { value: Roles.ROLE_EDIT_AVVIK, label: 'Rediger avvik' },
    { value: Roles.ROLE_DELETE, label: 'Slette skjema' }
];
