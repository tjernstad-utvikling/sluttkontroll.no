import { ActionType, Actions, State } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: State = {
    skjemaer: undefined,
    skjemaClipboard: undefined,
    skjemaToPast: [],
    measurements: undefined,
    measurementClipboard: undefined,
    measurementToPast: [],
    avvik: undefined,
    avvikClipboard: undefined,
    avvikToPast: [],
    kontroll: undefined,
    kontrollClipboard: undefined,
    kontrollToPast: []
};

export const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.setSelectedSkjemaer:
            return {
                ...state,
                skjemaer: action.payload
            };

        case ActionType.setSkjemaClipboard:
            return {
                ...state,
                skjemaClipboard: unionBy(
                    action.payload,
                    state.skjemaClipboard,
                    'id'
                )
            };
        case ActionType.removeSkjemaClipboard:
            return {
                ...state,
                skjemaClipboard: state.skjemaClipboard?.filter(
                    (sc) => sc.id !== action.payload.id
                )
            };

        case ActionType.setSkjemaToPast:
            return {
                ...state,
                skjemaToPast: action.payload
            };

        case ActionType.setSelectedMeasurements:
            return {
                ...state,
                measurements: action.payload
            };

        case ActionType.setMeasurementClipboard:
            return {
                ...state,
                measurementClipboard: unionBy(
                    action.payload,
                    state.measurementClipboard,
                    'id'
                )
            };
        case ActionType.removeMeasurementClipboard:
            return {
                ...state,
                measurementClipboard: state.measurementClipboard?.filter(
                    (mc) => mc.id !== action.payload.id
                )
            };

        case ActionType.setMeasurementToPast:
            return {
                ...state,
                measurementToPast: action.payload
            };

        case ActionType.setSelectedAvvik:
            return {
                ...state,
                avvik: action.payload
            };

        case ActionType.setAvvikClipboard:
            return {
                ...state,
                avvikClipboard: unionBy(
                    action.payload,
                    state.avvikClipboard,
                    'id'
                )
            };
        case ActionType.removeAvvikClipboard:
            return {
                ...state,
                avvikClipboard: state.avvikClipboard?.filter(
                    (mc) => mc.id !== action.payload.id
                )
            };

        case ActionType.setAvvikToPaste:
            return {
                ...state,
                avvikToPast: action.payload
            };

        case ActionType.setSelectedKontroll:
            return {
                ...state,
                kontroll: action.payload
            };

        case ActionType.setKontrollClipboard:
            return {
                ...state,
                kontrollClipboard: unionBy(
                    action.payload,
                    state.kontrollClipboard,
                    'id'
                )
            };
        case ActionType.removeKontrollClipboard:
            return {
                ...state,
                kontrollClipboard: state.kontrollClipboard?.filter(
                    (kc) => kc.id !== action.payload.id
                )
            };

        case ActionType.setKontrollToPaste:
            return {
                ...state,
                kontrollToPast: action.payload
            };

        default:
            throw new Error('unknown action');
    }
};
