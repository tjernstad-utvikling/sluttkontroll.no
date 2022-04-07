import { ActionType, KontrollActions, kontrollState } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: kontrollState = {
    kontroller: undefined,
    skjemaer: undefined
};

export const kontrollReducer = (
    state: kontrollState,
    action: KontrollActions
): kontrollState => {
    switch (action.type) {
        case ActionType.addKontroller:
            return {
                ...state,
                kontroller: unionBy(action.payload, state.kontroller, 'id')
            };
        case ActionType.newKontroll:
            return {
                ...state,
                kontroller:
                    state.kontroller !== undefined
                        ? [...state.kontroller, action.payload]
                        : [action.payload]
            };
        case ActionType.updateKontroll:
            return {
                ...state,
                kontroller: state.kontroller?.map((k) => {
                    if (k.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return k;
                    }
                })
            };
        case ActionType.addSkjemaer:
            return {
                ...state,
                skjemaer: unionBy(action.payload, state.skjemaer, 'id')
            };
        case ActionType.newSkjema:
            return {
                ...state,
                skjemaer:
                    state.skjemaer !== undefined
                        ? [...state.skjemaer, action.payload]
                        : [action.payload]
            };
        case ActionType.updateSkjema:
            return {
                ...state,
                skjemaer: state.skjemaer?.map((s) => {
                    if (s.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return s;
                    }
                })
            };
        case ActionType.removeSkjema:
            return {
                ...state,
                skjemaer: state.skjemaer?.filter(
                    (s) => s.id !== action.payload.skjemaId
                )
            };
        default:
            throw new Error('unknown action');
    }
};
