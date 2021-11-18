import { Skjema } from '../../contracts/kontrollApi';

export interface State {
    skjemaer: Skjema[] | undefined;
    skjemaClipboard: Skjema[] | undefined;
    skjemaToPast: Skjema[];
}

export enum ActionType {
    setSelectedSkjemaer,
    setSkjemaClipboard,
    removeSkjemaClipboard,
    setSkjemaToPast
}

export interface setSelectedSkjemaer {
    type: ActionType.setSelectedSkjemaer;
    payload: Skjema[];
}
export interface setSkjemaClipboard {
    type: ActionType.setSkjemaClipboard;
    payload: Skjema[];
}
export interface removeSkjemaClipboard {
    type: ActionType.removeSkjemaClipboard;
    payload: Skjema;
}
export interface setSkjemaToPast {
    type: ActionType.setSkjemaToPast;
    payload: Skjema[];
}

export type Actions =
    | setSelectedSkjemaer
    | setSkjemaClipboard
    | removeSkjemaClipboard
    | setSkjemaToPast;

export interface ContextInterface {
    state: State;

    closeScissors: () => void;
    openScissors: () => void;

    selectedSkjemaer: (skjemaer: Skjema[]) => void;
    setSkjemaerToPaste: (skjemaer: Skjema[]) => void;
    clipboardHasSkjema: boolean;

    handlePaste: (options: PasteOptions) => void;
}

export interface PasteOptions {
    skjemaPaste?: { kontrollId: number; skjema: Skjema[] };
}
