import {
    Checklist,
    Klient,
    Kontroll,
    Skjema
} from '../../contracts/kontrollApi';

export interface kontrollState {
    klienter: Array<Klient> | undefined;
    kontroller: Array<Kontroll> | undefined;
    skjemaer: Array<Skjema> | undefined;
    checklists: Array<Checklist> | undefined;
}

export enum ActionType {
    setKlienter,
    setKontroller,
    setSkjemaer,
    setChecklister
}

export interface setKlienter {
    type: ActionType.setKlienter;
    payload: Array<Klient>;
}

export interface setKontroller {
    type: ActionType.setKontroller;
    payload: Array<Kontroll>;
}
export interface setSkjemaer {
    type: ActionType.setSkjemaer;
    payload: Array<Skjema>;
}
export interface setChecklister {
    type: ActionType.setChecklister;
    payload: Array<Checklist>;
}

export type KontrollActions =
    | setKlienter
    | setKontroller
    | setSkjemaer
    | setChecklister;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
    loadKontroller: () => Promise<void>;
}
