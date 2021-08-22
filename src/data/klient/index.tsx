import { ActionType, ContextInterface } from './contracts';
import { ClientReducer, initialState } from './reducer';
import { Klient, Location } from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    editClient,
    editLocation,
    getClients,
    newClient,
    newLocation
} from '../../api/kontrollApi';

import { useSnackbar } from 'notistack';

export const useClient = () => {
    return useContext(ClientContext);
};

const ClientContext = createContext<ContextInterface>({} as ContextInterface);

export const ClientContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(ClientReducer, initialState);

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
    const saveEditKlient = async (name: string, klient: Klient) => {
        try {
            await editClient(klient.id, name);

            dispatch({
                type: ActionType.updateKlient,
                payload: { ...klient, name }
            });

            enqueueSnackbar('Klient lagret', {
                variant: 'success'
            });
            return true;
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av klient', {
                variant: 'error'
            });
        }
        return false;
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
    const saveEditLocation = async (
        name: string,
        klientId: number,
        location: Location
    ): Promise<boolean> => {
        try {
            await editLocation(name, location.id);

            dispatch({
                type: ActionType.updateLocation,
                payload: { location: { ...location, name }, klientId }
            });

            enqueueSnackbar('Lokasjon lagret', {
                variant: 'success'
            });
            return true;
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av lokasjon', {
                variant: 'error'
            });
        }
        return false;
    };

    return (
        <ClientContext.Provider
            value={{
                state,

                loadKlienter,
                saveNewKlient,
                saveEditKlient,

                saveNewLocation,
                saveEditLocation
            }}>
            {children}
        </ClientContext.Provider>
    );
};
