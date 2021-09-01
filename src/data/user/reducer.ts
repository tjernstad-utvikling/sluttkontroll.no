import { ActionType, UserActions, UserState } from './contracts';

export const initialState: UserState = {
    users: undefined
};

export const userReducer = (
    state: UserState,
    action: UserActions
): UserState => {
    switch (action.type) {
        case ActionType.setUsers:
            return { ...state, users: action.payload };

        case ActionType.UpdateUser:
            return {
                ...state,
                users: state.users?.map((u) => {
                    if (u.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return u;
                    }
                })
            };

        default:
            throw new Error('unknown action');
    }
};
