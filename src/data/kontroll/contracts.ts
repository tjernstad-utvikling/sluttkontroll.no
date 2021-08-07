import {
    Checklist,
    Klient,
    Kontroll,
    Location,
    Skjema
} from '../../contracts/kontrollApi';

import { Checkpoint } from '../../contracts/checkpointApi';
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
    updateKlient,
    newLocation,
    updateLocation,
    addKontroller,
    newKontroll,
    updateKontroll,
    addSkjemaer,
    newSkjema,
    addChecklists,
    editChecklists
}

export interface setKlienter {
    type: ActionType.setKlienter;
    payload: Array<Klient>;
}

export interface newKlient {
    type: ActionType.newKlient;
    payload: Klient;
}
export interface updateKlient {
    type: ActionType.updateKlient;
    payload: Klient;
}
export interface newLocation {
    type: ActionType.newLocation;
    payload: { location: Location; klient: Klient };
}
export interface updateLocation {
    type: ActionType.updateLocation;
    payload: { location: Location; klientId: number };
}

export interface addKontroller {
    type: ActionType.addKontroller;
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

export interface addSkjemaer {
    type: ActionType.addSkjemaer;
    payload: Array<Skjema>;
}
export interface newSkjema {
    type: ActionType.newSkjema;
    payload: Skjema;
}
export interface addChecklists {
    type: ActionType.addChecklists;
    payload: Array<Checklist>;
}
export interface editChecklists {
    type: ActionType.editChecklists;
    payload: { checklists: Array<Checklist>; skjemaId: number };
}

export type KontrollActions =
    | setKlienter
    | newKlient
    | updateKlient
    | newLocation
    | updateLocation
    | addKontroller
    | newKontroll
    | updateKontroll
    | addSkjemaer
    | newSkjema
    | addChecklists
    | editChecklists;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
    saveNewKlient: (
        name: string
    ) => Promise<{ status: boolean; klient?: Klient }>;
    saveEditKlient: (name: string, klient: Klient) => Promise<boolean>;
    saveNewLocation: (
        name: string,
        klient: Klient
    ) => Promise<{ status: boolean; location?: Location }>;
    saveEditLocation: (
        name: string,
        klientId: number,
        location: Location
    ) => Promise<boolean>;
    loadKontroller: () => Promise<void>;
    loadKontrollerByKlient: (klientId: number) => Promise<void>;
    loadKontrollerByObjekt: (objektId: number) => Promise<void>;
    saveNewKontroll: (
        name: string,
        avvikUtbedrere: Array<User>,
        location: Location,
        user: User
    ) => Promise<boolean>;
    updateKontroll: (kontroll: Kontroll) => Promise<boolean>;
    toggleStatusKontroll: (kontrollId: number) => Promise<boolean>;
    saveNewSkjema: (
        area: string,
        omrade: string,
        checkpoints: Checkpoint[],
        kontrollId: number
    ) => Promise<boolean>;
    saveEditChecklist: (
        skjemaId: number,
        checkpoints: Checkpoint[]
    ) => Promise<boolean>;
}
