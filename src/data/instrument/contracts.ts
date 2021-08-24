import { Instrument } from '../../contracts/instrumentApi';
import { User } from '../../contracts/userApi';

export interface InstrumentState {
    instruments: Instrument[] | undefined;
}

export enum ActionType {
    addInstruments
}

export interface addInstruments {
    type: ActionType.addInstruments;
    payload: Instrument[];
}

export type UserActions = addInstruments;

export interface ContextInterface {
    state: InstrumentState;
    loadInstruments: () => Promise<void>;
    addNewInstrument: (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ) => Promise<boolean>;
}
