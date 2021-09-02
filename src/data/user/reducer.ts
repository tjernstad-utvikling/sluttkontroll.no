import { ActionType, UserActions, UserState } from './contracts';

import _ from 'lodash';

export const initialState: UserState = {
    users: undefined
};

export const userReducer = (
    state: UserState,
    action: UserActions
): UserState => {
    switch (action.type) {
        case ActionType.addUsers:
            return {
                ...state,
                users: _.unionBy(action.payload, state.users, 'id')
            };

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
