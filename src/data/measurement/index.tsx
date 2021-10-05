import { ActionType, ContextInterface } from './contracts';
import {
    Measurement,
    NewFormMeasurement
} from '../../contracts/measurementApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    deleteMeasurement,
    getMeasurementByKontrollList,
    getMeasurementTypes,
    newMeasurement,
    updateMeasurementApi
} from '../../api/measurementApi';
import { initialState, userReducer } from './reducer';

import { Kontroll } from '../../contracts/kontrollApi';
import { errorHandler } from '../../tools/errorHandler';
import { useSnackbar } from 'notistack';

export const useMeasurement = () => {
    return useContext(MeasurementContext);
};

const MeasurementContext = createContext<ContextInterface>(
    {} as ContextInterface
);

export const MeasurementContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const { enqueueSnackbar } = useSnackbar();

    const loadMeasurementByKontroller = async (
        kontroller: Kontroll[]
    ): Promise<void> => {
        try {
            const { status, measurements } = await getMeasurementByKontrollList(
                kontroller.map((k) => k.id)
            );

            if (status === 200) {
                dispatch({
                    type: ActionType.addMeasurement,
                    payload: measurements
                });

                const { status, measurementTypes } =
                    await getMeasurementTypes();

                if (status === 200) {
                    dispatch({
                        type: ActionType.setMeasurementTypes,
                        payload: measurementTypes
                    });
                }
            }
        } catch (error: any) {
            errorHandler(error);
        }
    };

    const saveNewMeasurement = async (
        measurementData: NewFormMeasurement,
        skjemaID: number
    ): Promise<boolean> => {
        try {
            const { measurement } = await newMeasurement(
                measurementData,
                skjemaID
            );

            dispatch({
                type: ActionType.addMeasurement,
                payload: [measurement]
            });

            enqueueSnackbar('Måling lagret', {
                variant: 'success'
            });
            return true;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av måling', {
                variant: 'error'
            });
        }
        return false;
    };
    const updateMeasurement = async (
        measurementData: Measurement
    ): Promise<boolean> => {
        try {
            const { status } = await updateMeasurementApi(measurementData);
            if (status === 204) {
                dispatch({
                    type: ActionType.updateMeasurement,
                    payload: measurementData
                });

                enqueueSnackbar('Måling lagret', {
                    variant: 'success'
                });
                return true;
            }
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av måling', {
                variant: 'error'
            });
        }
        return false;
    };
    const removeMeasurement = async (
        measurementId: number
    ): Promise<boolean> => {
        try {
            const { status } = await deleteMeasurement(measurementId);

            if (status === 204) {
                dispatch({
                    type: ActionType.removeMeasurement,
                    payload: { measurementId }
                });

                enqueueSnackbar('Måling slettet', {
                    variant: 'success'
                });
                return true;
            }
        } catch (error: any) {
            enqueueSnackbar('Problemer med sletting av måling', {
                variant: 'error'
            });
        }
        return false;
    };

    return (
        <MeasurementContext.Provider
            value={{
                state,

                loadMeasurementByKontroller,
                updateMeasurement,
                removeMeasurement,
                saveNewMeasurement
            }}>
            {children}
        </MeasurementContext.Provider>
    );
};
