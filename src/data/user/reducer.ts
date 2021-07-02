import { ActionType, UserActions, UserState } from './contracts';

export const initialState: UserState = {
    users: undefined
};

export const kontrollReducer = (
    state: UserState,
    action: UserActions
): UserState => {
    switch (action.type) {
        case ActionType.setUsers:
            return { ...state, users: action.payload };

        default:
            throw new Error('unknown action');
    }
};
