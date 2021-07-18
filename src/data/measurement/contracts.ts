import { Measurement, MeasurementType } from '../../contracts/measurementApi';

import { Kontroll } from '../../contracts/kontrollApi';

export interface MeasurementState {
    measurements: Array<Measurement> | undefined;
    measurementTypes: MeasurementType[] | undefined;
}

export enum ActionType {
    addMeasurement,
    setMeasurementTypes
}

export interface addMeasurement {
    type: ActionType.addMeasurement;
    payload: Array<Measurement>;
}
export interface setMeasurementTypes {
    type: ActionType.setMeasurementTypes;
    payload: Array<MeasurementType>;
}

export type MeasurementActions = addMeasurement | setMeasurementTypes;

export interface ContextInterface {
    state: MeasurementState;
    loadMeasurementByKontroller: (kontroller: Kontroll[]) => Promise<void>;
}
