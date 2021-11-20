import {
    Checklist,
    Kontroll,
    Location,
    Skjema
} from '../../contracts/kontrollApi';

import { Checkpoint } from '../../contracts/checkpointApi';
import { User } from '../../contracts/userApi';

export interface kontrollState {
    kontroller: Array<Kontroll> | undefined;
    skjemaer: Array<Skjema> | undefined;
    checklists: Array<Checklist> | undefined;
}

export enum ActionType {
    addKontroller,
    newKontroll,
    updateKontroll,
    addSkjemaer,
    newSkjema,
    updateSkjema,
    removeSkjema,
    addChecklists,
    editChecklists,
    updateChecklist
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
export interface updateSkjema {
    type: ActionType.updateSkjema;
    payload: Skjema;
}
export interface removeSkjema {
    type: ActionType.removeSkjema;
    payload: { skjemaId: number };
}
export interface addChecklists {
    type: ActionType.addChecklists;
    payload: Array<Checklist>;
}
export interface editChecklists {
    type: ActionType.editChecklists;
    payload: { checklists: Array<Checklist>; skjemaId: number };
}
export interface updateChecklist {
    type: ActionType.updateChecklist;
    payload: Checklist;
}

export type KontrollActions =
    | addKontroller
    | newKontroll
    | updateKontroll
    | addSkjemaer
    | newSkjema
    | updateSkjema
    | removeSkjema
    | addChecklists
    | editChecklists
    | updateChecklist;

export interface ContextInterface {
    state: kontrollState;
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
    moveKontroll: (
        kontroll: Kontroll,
        klientId: number,
        locationId: number
    ) => Promise<boolean>;
    toggleStatusKontroll: (kontrollId: number) => Promise<boolean>;
    saveNewSkjema: (
        area: string,
        omrade: string,
        checkpoints: Checkpoint[],
        kontrollId: number
    ) => Promise<boolean>;
    updateSkjema: (skjema: Skjema) => Promise<boolean>;
    moveSkjema: (skjema: Skjema, kontrollId: number) => Promise<boolean>;
    removeSkjema: (skjemaId: number) => Promise<boolean>;
    saveEditChecklist: (
        skjemaId: number,
        checkpoints: Checkpoint[]
    ) => Promise<boolean>;
    toggleAktuellChecklist: (checklistId: number) => Promise<boolean>;
}
