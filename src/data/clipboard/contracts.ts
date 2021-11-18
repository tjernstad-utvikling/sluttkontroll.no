import { Measurement } from '../../contracts/measurementApi';
import { Skjema } from '../../contracts/kontrollApi';

export interface State {
    skjemaer: Skjema[] | undefined;
    skjemaClipboard: Skjema[] | undefined;
    skjemaToPast: Skjema[];

    measurements: Measurement[] | undefined;
    measurementClipboard: Measurement[] | undefined;
    measurementToPast: Measurement[];
}

export enum ActionType {
    setSelectedSkjemaer,
    setSkjemaClipboard,
    removeSkjemaClipboard,
    setSkjemaToPast,
    setSelectedMeasurements,
    setMeasurementClipboard,
    removeMeasurementClipboard,
    setMeasurementToPast
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

export type Actions =
    | setSelectedSkjemaer
    | setSkjemaClipboard
    | removeSkjemaClipboard
    | setSkjemaToPast
    | setSelectedMeasurements
    | setMeasurementClipboard
    | removeMeasurementClipboard
    | setMeasurementToPast;

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

    handlePaste: (options: PasteOptions) => void;
}

export interface PasteOptions {
    skjemaPaste?: { kontrollId: number; skjema: Skjema[] };
    measurementPaste?: { skjemaId: number; measurement: Measurement[] };
}
