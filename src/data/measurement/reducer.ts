import { ActionType, MeasurementActions, MeasurementState } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: MeasurementState = {
    measurements: undefined,
    measurementTypes: undefined
};

export const userReducer = (
    state: MeasurementState,
    action: MeasurementActions
): MeasurementState => {
    switch (action.type) {
        case ActionType.addMeasurement:
            return {
                ...state,
                measurements: unionBy(action.payload, state.measurements, 'id')
            };
        case ActionType.updateMeasurement:
            return {
                ...state,
                measurements: state.measurements?.map((m) => {
                    if (m.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return m;
                    }
                })
            };
        case ActionType.removeMeasurement:
            return {
                ...state,
                measurements: state.measurements?.filter(
                    (m) => m.id !== action.payload.measurementId
                )
            };
        case ActionType.setMeasurementTypes:
            return {
                ...state,
                measurementTypes: action.payload
            };

        default:
            throw new Error('unknown action');
    }
};
