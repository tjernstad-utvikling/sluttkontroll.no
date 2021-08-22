import { Instrument } from '../../contracts/instrument';

export interface InstrumentState {
    instruments: Instrument[] | undefined;
}

export enum ActionType {
    setInstruments
}

export interface setInstruments {
    type: ActionType.setInstruments;
    payload: Instrument[];
}

export type UserActions = setInstruments;

export interface ContextInterface {
    state: InstrumentState;
    loadInstruments: () => Promise<void>;
}
