import { Kontroll, Skjema } from '../../contracts/kontrollApi';
import {
    Measurement,
    MeasurementType,
    NewFormMeasurement
} from '../../contracts/measurementApi';

export interface MeasurementState {
    measurements: Array<Measurement> | undefined;
    measurementTypes: MeasurementType[] | undefined;
}

export enum ActionType {
    addMeasurement,
    updateMeasurement,
    setMeasurementTypes,
    removeMeasurement
}

export interface addMeasurement {
    type: ActionType.addMeasurement;
    payload: Array<Measurement>;
}
export interface updateMeasurement {
    type: ActionType.updateMeasurement;
    payload: Measurement;
}
export interface removeMeasurement {
    type: ActionType.removeMeasurement;
    payload: { measurementId: number };
}
export interface setMeasurementTypes {
    type: ActionType.setMeasurementTypes;
    payload: Array<MeasurementType>;
}

export type MeasurementActions =
    | addMeasurement
    | updateMeasurement
    | removeMeasurement
    | setMeasurementTypes;

export interface ContextInterface {
    state: MeasurementState;
    loadMeasurementByKontroller: (kontroller: Kontroll[]) => Promise<void>;
    saveNewMeasurement: (
        measurement: NewFormMeasurement,
        skjemaID: number
    ) => Promise<boolean>;
    updateMeasurement: (measurement: Measurement) => Promise<boolean>;
    moveMeasurement: (
        measurement: Measurement,
        skjema: Skjema
    ) => Promise<boolean>;
    removeMeasurement: (measurementId: number) => Promise<boolean>;
}
