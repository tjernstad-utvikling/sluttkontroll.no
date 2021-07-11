import {
    Checklist,
    Klient,
    Kontroll,
    Location,
    Skjema
} from '../../contracts/kontrollApi';

import { User } from '../../contracts/userApi';

export interface kontrollState {
    klienter: Array<Klient> | undefined;
    kontroller: Array<Kontroll> | undefined;
    skjemaer: Array<Skjema> | undefined;
    checklists: Array<Checklist> | undefined;
}

export enum ActionType {
    setKlienter,
    newKlient,
    newLocation,
    setKontroller,
    newKontroll,
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
export interface newLocation {
    type: ActionType.newLocation;
    payload: { location: Location; klient: Klient };
}

export interface setKontroller {
    type: ActionType.setKontroller;
    payload: Array<Kontroll>;
}
export interface newKontroll {
    type: ActionType.newKontroll;
    payload: Kontroll;
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
    | newLocation
    | setKontroller
    | newKontroll
    | updateKontroll
    | setSkjemaer
    | setChecklister;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
    saveNewKlient: (
        name: string
    ) => Promise<{ status: boolean; klient?: Klient }>;
    saveNewLocation: (
        name: string,
        klient: Klient
    ) => Promise<{ status: boolean; location?: Location }>;
    loadKontroller: () => Promise<void>;
    saveNewKontroll: (
        name: string,
        avvikUtbedrere: Array<User>,
        location: Location,
        user: User
    ) => Promise<boolean>;
    updateKontroll: (kontroll: Kontroll) => Promise<boolean>;
}
