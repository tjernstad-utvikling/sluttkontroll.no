import { User } from '../../contracts/userApi';

export interface UserState {
    users: Array<User> | undefined;
}

export enum ActionType {
    setUsers
}

export interface setUsers {
    type: ActionType.setUsers;
    payload: Array<User>;
}

export type UserActions = setUsers;

export interface ContextInterface {
    state: UserState;
    loadUsers: () => Promise<void>;
}
