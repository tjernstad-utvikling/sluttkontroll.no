import { Instrument } from '../../contracts/instrumentApi';

export interface TemplateState {
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

export type Actions = addInstruments | updateInstrument;

export interface ContextInterface {
    state: TemplateState;
    loadInstruments: () => Promise<void>;
}
