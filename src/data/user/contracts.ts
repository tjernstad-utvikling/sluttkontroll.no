import { Roles, User } from '../../contracts/userApi';

export interface UserState {
    users: User[] | undefined;
}

export enum ActionType {
    UpdateUser,
    addUsers
}

export interface addUsers {
    type: ActionType.addUsers;
    payload: User[];
}

export interface UpdateUser {
    type: ActionType.UpdateUser;
    payload: User;
}

export type UserActions = addUsers | UpdateUser;

export interface ContextInterface {
    state: UserState;
    loadUsers: () => Promise<void>;
    updateUserInState: (user: User) => void;
    updateUser: (user: User) => Promise<boolean>;
    newUser: (
        name: string,
        email: string,
        phone: string,
        roles: Roles[] | undefined
    ) => Promise<boolean>;
}
