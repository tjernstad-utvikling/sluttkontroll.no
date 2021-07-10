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
    newKlient,
    setKontroller,
    updateKontroll,
    setSkjemaer,
    setChecklister
}

export interface setKlienter {
    type: ActionType.setKlienter;
    payload: Array<Klient>;
}

export interface newKlient {
    type: ActionType.newKlient;
    payload: Klient;
}

export interface setKontroller {
    type: ActionType.setKontroller;
    payload: Array<Kontroll>;
}
export interface updateKontroll {
    type: ActionType.updateKontroll;
    payload: Kontroll;
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
    | newKlient
    | setKontroller
    | updateKontroll
    | setSkjemaer
    | setChecklister;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
    saveNewKlient: (
        name: string
    ) => Promise<{ status: boolean; klient?: Klient }>;
    loadKontroller: () => Promise<void>;
    updateKontroll: (kontroll: Kontroll) => Promise<boolean>;
}
