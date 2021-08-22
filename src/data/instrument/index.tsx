import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, instrumentReducer } from './reducer';

import { getInstruments } from '../../api/instrument';

export const useInstrument = () => {
    return useContext(InstrumentContext);
};

const InstrumentContext = createContext<ContextInterface>(
    {} as ContextInterface
);

export const InstrumentContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(instrumentReducer, initialState);
    const [hasLoadedInstruments, setHasLoadedInstruments] =
        useState<boolean>(false);

    const loadInstruments = async (): Promise<void> => {
        if (!hasLoadedInstruments) {
            try {
                const { status, instruments } = await getInstruments();

                if (status === 200) {
                    dispatch({
                        type: ActionType.setInstruments,
                        payload: instruments
                    });
                }
            } catch (error) {
                console.log(error);
            }
            setHasLoadedInstruments(true);
        }
    };

    return (
        <InstrumentContext.Provider
            value={{
                state,

                loadInstruments
            }}>
            {children}
        </InstrumentContext.Provider>
    );
};
