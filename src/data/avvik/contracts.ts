import { Avvik } from '../../contracts/avvikApi';
import { Kontroll } from '../../contracts/kontrollApi';

export interface AvvikState {
    avvik: Array<Avvik> | undefined;
}

export enum ActionType {
    addAvvik
}

export interface addAvvik {
    type: ActionType.addAvvik;
    payload: Array<Avvik>;
}

export type AvvikActions = addAvvik;

export interface ContextInterface {
    state: AvvikState;
    loadAvvikByKontroller: (kontroller: Kontroll[]) => Promise<void>;
}
