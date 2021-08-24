import { ActionType, InstrumentState, UserActions } from './contracts';

import _ from 'lodash';

export const initialState: InstrumentState = {
    instruments: undefined
};

export const instrumentReducer = (
    state: InstrumentState,
    action: UserActions
): InstrumentState => {
    switch (action.type) {
        case ActionType.addInstruments:
            return {
                ...state,
                instruments: _.unionBy(action.payload, state.instruments, 'id')
            };

        default:
            throw new Error('unknown action');
    }
};
