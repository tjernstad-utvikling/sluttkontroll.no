import { ActionType, KontrollActions, kontrollState } from './contracts';

import _ from 'lodash';

export const initialState: kontrollState = {
    klienter: undefined,
    kontroller: undefined,
    skjemaer: undefined,
    checklists: undefined
};

export const kontrollReducer = (
    state: kontrollState,
    action: KontrollActions
): kontrollState => {
    switch (action.type) {
        case ActionType.setKlienter:
            return { ...state, klienter: action.payload };
        case ActionType.newKlient:
            return {
                ...state,
                klienter:
                    state.klienter !== undefined
                        ? [...state.klienter, action.payload]
                        : [action.payload]
            };
        case ActionType.updateKlient:
            return {
                ...state,
                klienter: state.klienter?.map((k) => {
                    if (k.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return k;
                    }
                })
            };
        case ActionType.newLocation:
            return {
                ...state,
                klienter: state.klienter?.map((k) => {
                    if (k.id === action.payload.klient.id) {
                        return {
                            ...k,
                            objekts: [...k.objekts, action.payload.location]
                        };
                    } else {
                        return k;
                    }
                })
            };
        case ActionType.addKontroller:
            return {
                ...state,
                kontroller: _.unionBy(action.payload, state.kontroller, 'id')
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
                skjemaer: _.unionBy(action.payload, state.skjemaer, 'id')
            };
        case ActionType.newSkjema:
            return {
                ...state,
                skjemaer:
                    state.skjemaer !== undefined
                        ? [...state.skjemaer, action.payload]
                        : [action.payload]
            };
        case ActionType.addChecklists:
            return {
                ...state,
                checklists: _.unionBy(action.payload, state.checklists, 'id')
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
        default:
            throw new Error('unknown action');
    }
};
