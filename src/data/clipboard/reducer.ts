import { ActionType, Actions, State } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: State = {
    skjemaer: undefined,
    skjemaClipboard: undefined,
    skjemaToPast: []
};

export const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.setSelectedSkjemaer:
            return {
                ...state,
                skjemaer: action.payload
            };

        case ActionType.setSkjemaClipboard:
            return {
                ...state,
                skjemaClipboard: unionBy(action.payload, state.skjemaer, 'id')
            };
        case ActionType.removeSkjemaClipboard:
            return {
                ...state,
                skjemaClipboard: state.skjemaClipboard?.filter(
                    (sc) => sc.id !== action.payload.id
                )
            };

        case ActionType.setSkjemaToPast:
            return {
                ...state,
                skjemaToPast: action.payload
            };

        default:
            throw new Error('unknown action');
    }
};
