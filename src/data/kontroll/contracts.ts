import { Checklist, Kontroll, Skjema } from '../../contracts/kontrollApi';

import { Checkpoint } from '../../contracts/checkpointApi';

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

    showAllKontroller: boolean;
    setShowAllKontroller: (state: boolean) => void;

    moveSkjema: (skjema: Skjema, kontrollId: number) => Promise<boolean>;
    removeSkjema: (skjemaId: number) => Promise<boolean>;
    saveEditChecklist: (
        skjemaId: number,
        checkpoints: Checkpoint[]
    ) => Promise<boolean>;
    toggleAktuellChecklist: (checklistId: number) => Promise<boolean>;
}
