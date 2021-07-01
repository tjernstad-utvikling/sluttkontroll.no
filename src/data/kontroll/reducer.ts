import { ActionType, KontrollActions, kontrollState } from './contracts';

export const initialState: kontrollState = {} as kontrollState;

export const kontrollReducer = (
    state: kontrollState,
    action: KontrollActions
): kontrollState => {
    switch (action.type) {
        case ActionType.setKlienter:
            return { ...state, klienter: action.payload };

        default:
            return state;
    }
};
