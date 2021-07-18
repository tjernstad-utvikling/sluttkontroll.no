import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import {
    getMeasurementByKontrollList,
    getMeasurementTypes
} from '../../api/measurementApi';
import { initialState, userReducer } from './reducer';

import { Kontroll } from '../../contracts/kontrollApi';

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
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <MeasurementContext.Provider
            value={{
                state,

                loadMeasurementByKontroller
            }}>
            {children}
        </MeasurementContext.Provider>
    );
};
