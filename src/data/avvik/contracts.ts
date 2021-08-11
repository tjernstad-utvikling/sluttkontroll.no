import { Avvik } from '../../contracts/avvikApi';
import { Kontroll } from '../../contracts/kontrollApi';

export interface AvvikState {
    avvik: Array<Avvik> | undefined;
}

export enum ActionType {
    addAvvik,
    deleteAvvik
}

export interface addAvvik {
    type: ActionType.addAvvik;
    payload: Array<Avvik>;
}
export interface deleteAvvik {
    type: ActionType.deleteAvvik;
    payload: { avvikId: number };
}

export type AvvikActions = addAvvik | deleteAvvik;

export interface ContextInterface {
    state: AvvikState;
    loadAvvikByKontroller: (kontroller: Kontroll[]) => Promise<void>;
    deleteAvvik: (avvikId: number) => Promise<boolean>;
}
