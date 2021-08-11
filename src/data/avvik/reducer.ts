import { ActionType, AvvikActions, AvvikState } from './contracts';

import _ from 'lodash';

export const initialState: AvvikState = {
    avvik: undefined
};

export const userReducer = (
    state: AvvikState,
    action: AvvikActions
): AvvikState => {
    switch (action.type) {
        case ActionType.addAvvik:
            return {
                ...state,
                avvik: _.unionBy(action.payload, state.avvik, 'id')
            };
        case ActionType.deleteAvvik:
            return {
                ...state,
                avvik: state.avvik?.filter(
                    (a) => a.id !== action.payload.avvikId
                )
            };
        case ActionType.updateAvvik:
            return {
                ...state,
                avvik: state.avvik?.map((a) => {
                    if (a.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return a;
                    }
                })
            };

        default:
            throw new Error('unknown action');
    }
};
