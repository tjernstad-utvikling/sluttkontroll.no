import { Instrument } from '../../contracts/instrumentApi';
import { SlkUser } from '../../contracts/user';
import { User } from '../../contracts/userApi';

export interface InstrumentState {
    instruments: Instrument[] | undefined;
}

export enum ActionType {
    addInstruments,
    updateInstrument
}

export interface addInstruments {
    type: ActionType.addInstruments;
    payload: Instrument[];
}
export interface updateInstrument {
    type: ActionType.updateInstrument;
    payload: Instrument;
}

export type UserActions = addInstruments | updateInstrument;

export interface ContextInterface {
    state: InstrumentState;
    loadInstruments: () => Promise<void>;
    updateInstruments: (instrument: Instrument) => Promise<boolean>;
    updateInstrumentDisponent: (
        instrument: Instrument,
        user: SlkUser
    ) => Promise<boolean>;
    addCalibration: (
        instrumentId: number,
        kalibrertDate: string,
        sertifikatFile: File
    ) => Promise<boolean>;
    addNewInstrument: (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ) => Promise<boolean>;
}
