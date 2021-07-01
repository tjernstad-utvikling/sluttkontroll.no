import { Klient } from '../../contracts/kontrollApi';

export interface kontrollState {
    klienter: Array<Klient> | undefined;
}

export enum ActionType {
    setKlienter
}

export interface setKlienter {
    type: ActionType.setKlienter;
    payload: Array<Klient>;
}

export type KontrollActions = setKlienter;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
}
