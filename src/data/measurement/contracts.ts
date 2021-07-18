import { Kontroll } from '../../contracts/kontrollApi';
import { Measurement } from '../../contracts/measurementApi';

export interface MeasurementState {
    measurement: Array<Measurement> | undefined;
}

export enum ActionType {
    addMeasurement
}

export interface addMeasurement {
    type: ActionType.addMeasurement;
    payload: Array<Measurement>;
}

export type MeasurementActions = addMeasurement;

export interface ContextInterface {
    state: MeasurementState;
    loadMeasurementByKontroller: (kontroller: Kontroll[]) => Promise<void>;
}
