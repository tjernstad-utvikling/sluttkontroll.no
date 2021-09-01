import { User } from '../../contracts/userApi';

export interface UserState {
    users: Array<User> | undefined;
}

export enum ActionType {
    setUsers,
    UpdateUser
}

export interface setUsers {
    type: ActionType.setUsers;
    payload: Array<User>;
}

export interface UpdateUser {
    type: ActionType.UpdateUser;
    payload: User;
}

export type UserActions = setUsers | UpdateUser;

export interface ContextInterface {
    state: UserState;
    loadUsers: () => Promise<void>;
    updateUserInState: (user: User) => void;
}
