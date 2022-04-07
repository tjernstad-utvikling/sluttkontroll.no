import { Avvik } from '../../contracts/avvikApi';
import { User } from '../../contracts/userApi';

export interface AvvikState {}

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

    newAvvik: (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null,
        checklistId: number
    ) => Promise<Avvik | false>;
    deleteAvvikImage: (avvik: Avvik, imageId: number) => Promise<boolean>;
    addAvvikImages: (avvik: Avvik, images: File[]) => Promise<boolean>;
}
