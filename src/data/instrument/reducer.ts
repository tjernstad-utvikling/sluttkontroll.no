import { ActionType, InstrumentState, UserActions } from './contracts';

export const initialState: InstrumentState = {
    instruments: undefined
};

export const instrumentReducer = (
    state: InstrumentState,
    action: UserActions
): InstrumentState => {
    switch (action.type) {
        case ActionType.setInstruments:
            return { ...state, instruments: action.payload };

        default:
            throw new Error('unknown action');
    }
};
