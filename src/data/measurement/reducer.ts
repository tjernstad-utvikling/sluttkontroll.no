import { ActionType, MeasurementActions, MeasurementState } from './contracts';

import _ from 'lodash';

export const initialState: MeasurementState = {
    measurement: undefined
};

export const userReducer = (
    state: MeasurementState,
    action: MeasurementActions
): MeasurementState => {
    switch (action.type) {
        case ActionType.addMeasurement:
            return {
                ...state,
                measurement: _.unionBy(action.payload, state.measurement, 'id')
            };

        default:
            throw new Error('unknown action');
    }
};
