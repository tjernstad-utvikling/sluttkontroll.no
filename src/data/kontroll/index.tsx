import { ActionType, ContextInterface } from './contracts';
import { Klient, Kontroll } from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    getClients,
    getKontroller,
    newClient,
    newLocation,
    updateKontroll as updateKontrollApi
} from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

import { useSnackbar } from 'notistack';

export const useKontroll = () => {
    return useContext(KontrollContext);
};

const KontrollContext = createContext<ContextInterface>({} as ContextInterface);

export const KontrollContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(kontrollReducer, initialState);

    const { enqueueSnackbar } = useSnackbar();

    const loadKlienter = async (): Promise<void> => {
        try {
            const { status, klienter } = await getClients();

            if (status === 200) {
                dispatch({
                    type: ActionType.setKlienter,
                    payload: klienter
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveNewKlient = async (name: string) => {
        try {
            const { klient } = await newClient(name);

            dispatch({
                type: ActionType.newKlient,
                payload: klient
            });

            enqueueSnackbar('Klient lagret', {
                variant: 'success'
            });
            return { status: true, klient };
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av klient', {
                variant: 'error'
            });
        }
        return { status: false };
    };

    const saveNewLocation = async (name: string, klient: Klient) => {
        try {
            const { location } = await newLocation(name, klient);

            dispatch({
                type: ActionType.newLocation,
                payload: { location, klient }
            });

            enqueueSnackbar('Lokasjon lagret', {
                variant: 'success'
            });
            return { status: true, location };
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av lokasjon', {
                variant: 'error'
            });
        }
        return { status: false };
    };
    const loadKontroller = async (): Promise<void> => {
        try {
            const { status, kontroller, skjemaer, checklists } =
                await getKontroller();

            if (status === 200) {
                dispatch({
                    type: ActionType.setKontroller,
                    payload: kontroller
                });
                dispatch({
                    type: ActionType.setSkjemaer,
                    payload: skjemaer
                });
                dispatch({
                    type: ActionType.setChecklister,
                    payload: checklists
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateKontroll = async (kontroll: Kontroll): Promise<boolean> => {
        try {
            await updateKontrollApi(kontroll);

            dispatch({
                type: ActionType.updateKontroll,
                payload: kontroll
            });

            enqueueSnackbar('Kontroll oppdatert', {
                variant: 'success'
            });
            return true;
        } catch (error) {
            enqueueSnackbar('Problemer med oppdatering av kontrollen', {
                variant: 'error'
            });
        }
        return false;
    };

    return (
        <KontrollContext.Provider
            value={{
                state,

                loadKontroller,
                loadKlienter,
                saveNewKlient,
                updateKontroll,
                saveNewLocation
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
