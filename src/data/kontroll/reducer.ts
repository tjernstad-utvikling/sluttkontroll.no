import { ActionType, KontrollActions, kontrollState } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: kontrollState = {
    kontroller: undefined,
    skjemaer: undefined,
    checklists: undefined
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
        case ActionType.addChecklists:
            return {
                ...state,
                checklists: unionBy(action.payload, state.checklists, 'id')
            };
        case ActionType.editChecklists:
            return {
                ...state,
                checklists:
                    state.checklists !== undefined
                        ? [
                              ...state.checklists.filter(
                                  (cl) =>
                                      cl.skjema.id !== action.payload.skjemaId
                              ),
                              ...action.payload.checklists
                          ]
                        : [...action.payload.checklists]
            };
        case ActionType.updateChecklist:
            return {
                ...state,
                checklists: state.checklists?.map((c) => {
                    if (c.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return c;
                    }
                })
            };
        default:
            throw new Error('unknown action');
    }
};
