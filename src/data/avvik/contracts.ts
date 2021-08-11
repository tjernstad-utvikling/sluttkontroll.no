import { Avvik } from '../../contracts/avvikApi';
import { Kontroll } from '../../contracts/kontrollApi';

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
}
