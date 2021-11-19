import { Checklist, Kontroll, Skjema } from '../../contracts/kontrollApi';

import { Avvik } from '../../contracts/avvikApi';
import { User } from '../../contracts/userApi';

export interface AvvikState {
    avvik: Array<Avvik> | undefined;
}

export enum ActionType {
    addAvvik,
    deleteAvvik,
    updateAvvik
}

export interface addAvvik {
    type: ActionType.addAvvik;
    payload: Array<Avvik>;
}
export interface deleteAvvik {
    type: ActionType.deleteAvvik;
    payload: { avvikId: number };
}
export interface updateAvvik {
    type: ActionType.updateAvvik;
    payload: Avvik;
}

export type AvvikActions = addAvvik | deleteAvvik | updateAvvik;

export interface ContextInterface {
    state: AvvikState;
    loadAvvikByKontroller: (kontroller: Kontroll[]) => Promise<void>;
    deleteAvvik: (avvikId: number) => Promise<boolean>;
    updateAvvik: (avvik: Avvik) => Promise<boolean>;
    moveAvvik: (
        avvik: Avvik,
        checklist: Checklist,
        skjema: Skjema
    ) => Promise<boolean>;
    setUtbedrere: (avvikIds: number[], utbedrere: User[]) => Promise<boolean>;
    closeAvvik: (avvikIds: number[], kommentar: string) => Promise<boolean>;
    openAvvik: (avvikId: number) => Promise<boolean>;
    newAvvik: (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null,
        checklistId: number
    ) => Promise<Avvik | false>;
    deleteAvvikImage: (avvik: Avvik, imageId: number) => Promise<boolean>;
    addAvvikImages: (avvik: Avvik, images: File[]) => Promise<boolean>;
}
