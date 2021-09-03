import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import {
    addCalibration as addCalibrationApi,
    addCalibrationFile,
    editInstrument,
    getInstruments,
    newInstrument,
    removeDisponent,
    setDisponent
} from '../../api/instrumentApi';
import { initialState, instrumentReducer } from './reducer';

import { Instrument } from '../../contracts/instrumentApi';
import { User } from '../../contracts/userApi';
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
    const [hasLoadedInstruments, setHasLoadedInstruments] =
        useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const loadInstruments = async (): Promise<void> => {
        if (!hasLoadedInstruments) {
            try {
                const { status, instruments } = await getInstruments();

                if (status === 200) {
                    dispatch({
                        type: ActionType.addInstruments,
                        payload: instruments
                    });
                }
            } catch (error) {
                console.log(error);
            }
            setHasLoadedInstruments(true);
        }
    };

    const addNewInstrument = async (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ): Promise<boolean> => {
        try {
            const { status, instrument, message } = await newInstrument({
                name,
                serienr,
                user,
                toCalibrate,
                calibrationInterval
            });
            if (status === 400 && message !== undefined) {
                enqueueSnackbar('Ikke alle nødvendige felter er fylt ut', {
                    variant: 'warning'
                });
            }

            if (status === 200 && instrument !== undefined) {
                dispatch({
                    type: ActionType.addInstruments,
                    payload: [instrument]
                });
                enqueueSnackbar('Nytt instrument lagret', {
                    variant: 'success'
                });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med lagring av instrument', {
                variant: 'error'
            });
            return false;
        }
    };

    const addCalibration = async (
        instrumentId: number,
        kalibrertDate: string,
        sertifikatFile: File
    ): Promise<boolean> => {
        try {
            const { status, message, instrument } = await addCalibrationApi(
                instrumentId,
                kalibrertDate
            );

            if (status === 400 && message !== undefined) {
                enqueueSnackbar('Ikke alle nødvendige felter er fylt ut', {
                    variant: 'warning'
                });
            }

            if (
                status === 200 &&
                instrument !== undefined &&
                instrument.sisteKalibrert !== null
            ) {
                const { status } = await addCalibrationFile(
                    instrument.sisteKalibrert.id,
                    sertifikatFile
                );
                if (status === 204) {
                    dispatch({
                        type: ActionType.addInstruments,
                        payload: [instrument]
                    });
                    enqueueSnackbar('Kalibrering registrert', {
                        variant: 'success'
                    });
                    return true;
                }
                if (status === 400) {
                    enqueueSnackbar('Kalibreringsbevis mangler', {
                        variant: 'warning'
                    });
                }
            }
            return false;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med lagring av instrument', {
                variant: 'error'
            });
            return false;
        }
    };
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
        } catch (error) {
            console.log(error);
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
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med lagring av instrument', {
                variant: 'error'
            });
            return false;
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
