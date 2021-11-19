import { Avvik } from '../../contracts/avvikApi';
import { Measurement } from '../../contracts/measurementApi';
import { Skjema } from '../../contracts/kontrollApi';

export interface State {
    skjemaer: Skjema[] | undefined;
    skjemaClipboard: Skjema[] | undefined;
    skjemaToPast: Skjema[];

    measurements: Measurement[] | undefined;
    measurementClipboard: Measurement[] | undefined;
    measurementToPast: Measurement[];

    avvik: Avvik[] | undefined;
    avvikClipboard: Avvik[] | undefined;
    avvikToPast: Avvik[];
}

export enum ActionType {
    setSelectedSkjemaer,
    setSkjemaClipboard,
    removeSkjemaClipboard,
    setSkjemaToPast,

    setSelectedMeasurements,
    setMeasurementClipboard,
    removeMeasurementClipboard,
    setMeasurementToPast,

    setSelectedAvvik,
    setAvvikClipboard,
    removeAvvikClipboard,
    setAvvikToPaste
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

export interface setSelectedMeasurements {
    type: ActionType.setSelectedMeasurements;
    payload: Measurement[];
}
export interface setMeasurementClipboard {
    type: ActionType.setMeasurementClipboard;
    payload: Measurement[];
}
export interface removeMeasurementClipboard {
    type: ActionType.removeMeasurementClipboard;
    payload: Measurement;
}
export interface setMeasurementToPast {
    type: ActionType.setMeasurementToPast;
    payload: Measurement[];
}

export interface setSelectedAvvik {
    type: ActionType.setSelectedAvvik;
    payload: Avvik[];
}
export interface setAvvikClipboard {
    type: ActionType.setAvvikClipboard;
    payload: Avvik[];
}
export interface removeAvvikClipboard {
    type: ActionType.removeAvvikClipboard;
    payload: Avvik;
}
export interface setAvvikToPaste {
    type: ActionType.setAvvikToPaste;
    payload: Avvik[];
}

export type Actions =
    | setSelectedSkjemaer
    | setSkjemaClipboard
    | removeSkjemaClipboard
    | setSkjemaToPast
    | setSelectedMeasurements
    | setMeasurementClipboard
    | removeMeasurementClipboard
    | setMeasurementToPast
    | setSelectedAvvik
    | setAvvikClipboard
    | removeAvvikClipboard
    | setAvvikToPaste;

export interface ContextInterface {
    state: State;

    closeScissors: () => void;
    openScissors: () => void;

    selectedSkjemaer: (skjemaer: Skjema[]) => void;
    setSkjemaerToPaste: (skjemaer: Skjema[]) => void;
    clipboardHasSkjema: boolean;

    selectedMeasurements: (measurements: Measurement[]) => void;
    setMeasurementToPaste: (measurements: Measurement[]) => void;
    clipboardHasMeasurement: boolean;

    selectedAvvik: (avvik: Avvik[]) => void;
    setAvvikToPaste: (avvik: Avvik[]) => void;
    clipboardHasAvvik: boolean;

    handlePaste: (options: PasteOptions) => void;
}

export interface PasteOptions {
    skjemaPaste?: { kontrollId: number; skjema: Skjema[] };
    measurementPaste?: { skjemaId: number; measurement: Measurement[] };
    avvikPaste?: { checklistId: number; avvik: Avvik[] };
}
