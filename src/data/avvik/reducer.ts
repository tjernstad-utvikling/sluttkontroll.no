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

        default:
            throw new Error('unknown action');
    }
};
