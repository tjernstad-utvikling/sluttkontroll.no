import { ActionType, InstrumentState, UserActions } from './contracts';

import unionBy from 'lodash.unionby';

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
                instruments: unionBy(action.payload, state.instruments, 'id')
            };
        case ActionType.updateInstrument:
            return {
                ...state,
                instruments: state.instruments?.map((i) => {
                    if (i.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return i;
                    }
                })
            };

        default:
            throw new Error('unknown action');
    }
};
