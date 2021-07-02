import { ActionType, KontrollActions, kontrollState } from './contracts';

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
        case ActionType.setKontroller:
            return { ...state, kontroller: action.payload };
        case ActionType.setSkjemaer:
            return { ...state, skjemaer: action.payload };
        case ActionType.setChecklister:
            return { ...state, checklists: action.payload };

        default:
            throw new Error('unknown action');
    }
};
