import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import {
    editInstrument,
    removeDisponent,
    setDisponent
} from '../../api/instrumentApi';
import { initialState, instrumentReducer } from './reducer';

import { Instrument } from '../../contracts/instrumentApi';
import { User } from '../../contracts/userApi';
import { errorHandler } from '../../tools/errorHandler';
import { useSnackbar } from 'notistack';

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

    const { enqueueSnackbar } = useSnackbar();

    const updateInstruments = async (
        instrument: Instrument
    ): Promise<boolean> => {
        try {
            const { status, message } = await editInstrument(instrument);

            if (status === 400 && message !== undefined) {
                enqueueSnackbar('Ikke alle nødvendige felter er fylt ut', {
                    variant: 'warning'
                });
            }

            if (status === 204 && instrument !== undefined) {
                dispatch({
                    type: ActionType.addInstruments,
                    payload: [instrument]
                });
                enqueueSnackbar('Instrument oppdatert', {
                    variant: 'success'
                });
                return true;
            }
            return false;
        } catch (error: any) {
            errorHandler(error);
            enqueueSnackbar('Problemer med lagring av instrument', {
                variant: 'error'
            });
            return false;
        }
    };
    const updateInstrumentDisponent = async (
        instrument: Instrument,
        user: User
    ): Promise<boolean> => {
        try {
            if (instrument.disponent?.id === user.id) {
                const { status } = await removeDisponent(instrument.id);
                if (status === 204 && instrument !== undefined) {
                    dispatch({
                        type: ActionType.addInstruments,
                        payload: [{ ...instrument, disponent: null }]
                    });
                    enqueueSnackbar('Instrument er levert', {
                        variant: 'success'
                    });
                    return true;
                }
            } else {
                const { status } = await setDisponent(instrument.id, user.id);
                if (status === 204 && instrument !== undefined) {
                    dispatch({
                        type: ActionType.addInstruments,
                        payload: [{ ...instrument, disponent: user }]
                    });
                    enqueueSnackbar('Instrumentet er booket', {
                        variant: 'success'
                    });
                    return true;
                }
            }

            return false;
        } catch (error: any) {
            errorHandler(error);
            enqueueSnackbar('Problemer med lagring av instrument', {
                variant: 'error'
            });
            return false;
        }
    };

    return (
        <InstrumentContext.Provider
            value={{
                updateInstrumentDisponent
            }}>
            {children}
        </InstrumentContext.Provider>
    );
};
