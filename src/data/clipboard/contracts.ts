import { Skjema } from '../../contracts/kontrollApi';

export interface State {
    skjemaer: Skjema[] | undefined;
    skjemaClipboard: Skjema[] | undefined;
}

export enum ActionType {
    setSelectedSkjemaer,
    setSkjemaClipboard
}

export interface setSelectedSkjemaer {
    type: ActionType.setSelectedSkjemaer;
    payload: Skjema[];
}
export interface setSkjemaClipboard {
    type: ActionType.setSkjemaClipboard;
    payload: Skjema[];
}

export type Actions = setSelectedSkjemaer | setSkjemaClipboard;

export interface ContextInterface {
    state: State;

    closeScissors: () => void;
    openScissors: () => void;
    selectedSkjemaer: (skjemaer: Skjema[]) => void;
    clipboardHasSkjema: boolean;
}
