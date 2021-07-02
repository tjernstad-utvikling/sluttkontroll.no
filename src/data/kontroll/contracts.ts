import { Klient, Kontroll } from '../../contracts/kontrollApi';

export interface kontrollState {
    klienter: Array<Klient> | undefined;
    kontroller: Array<Kontroll> | undefined;
}

export enum ActionType {
    setKlienter,
    setKontroller
}

export interface setKlienter {
    type: ActionType.setKlienter;
    payload: Array<Klient>;
}

export interface setKontroller {
    type: ActionType.setKontroller;
    payload: Array<Kontroll>;
}

export type KontrollActions = setKlienter | setKontroller;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
    loadKontroller: () => Promise<void>;
}
