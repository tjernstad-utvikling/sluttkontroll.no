import { ActionType, MeasurementActions, MeasurementState } from './contracts';

import _ from 'lodash';

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
                measurements: _.unionBy(
                    action.payload,
                    state.measurements,
                    'id'
                )
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
