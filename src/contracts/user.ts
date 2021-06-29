export interface SlkUser {
    id: number;
    name: string;
    phone: string;
    email: string;
    roles: Array<RolesEnum>;
}

export enum RolesEnum {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_EDIT_USER = 'ROLE_EDIT_USER',
    ROLE_EDIT_ROLES = 'ROLE_EDIT_ROLES',
    ROLE_LUKKE_AVVIK = 'ROLE_LUKKE_AVVIK',
    ROLE_EDIT_AVVIK = 'ROLE_EDIT_AVVIK',
    ROLE_DELETE = 'ROLE_DELETE'
}
