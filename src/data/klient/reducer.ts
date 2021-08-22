import { ActionType, KontrollActions, kontrollState } from './contracts';

export const initialState: kontrollState = {
    klienter: undefined
};

export const ClientReducer = (
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
        case ActionType.updateLocation:
            return {
                ...state,
                klienter: state.klienter?.map((k) => {
                    if (k.id === action.payload.klientId) {
                        return {
                            ...k,
                            objekts: k.objekts.map((o) => {
                                if (o.id === action.payload.location.id) {
                                    return action.payload.location;
                                } else {
                                    return o;
                                }
                            })
                        };
                    } else {
                        return k;
                    }
                })
            };

        default:
            throw new Error('unknown action');
    }
};
