import { ActionType, ContextInterface } from './contracts';
import { ClientReducer, initialState } from './reducer';
import { Klient, Location } from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer } from 'react';
import { deleteImageFile, uploadImageFile } from '../../api/locationApi';
import { editClient, editLocation, newLocation } from '../../api/kontrollApi';

import { errorHandler } from '../../tools/errorHandler';
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

    const saveEditKlient = async (name: string, klient: Klient) => {
        try {
            await editClient(klient.id, name);

            dispatch({
                type: ActionType.updateKlient,
                payload: { ...klient, name }
            });

            enqueueSnackbar('Kunde lagret', {
                variant: 'success'
            });
            return true;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av kunde', {
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
        } catch (error: any) {
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
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av lokasjon', {
                variant: 'error'
            });
        }
        return false;
    };
    const addLocationImage = async ({
        image,
        klientId,
        locationId
    }: {
        image: File;
        klientId: number;
        locationId: number;
    }): Promise<boolean> => {
        try {
            const { status, locationImage } = await uploadImageFile(
                locationId,
                image
            );

            if (status === 200 && state.klienter) {
                const location = state.klienter
                    ?.find((k) => k.id === klientId)
                    ?.locations.find((l) => l.id === locationId);

                if (location && locationImage)
                    dispatch({
                        type: ActionType.updateLocation,
                        payload: {
                            location: {
                                ...location,
                                locationImage: locationImage
                            },
                            klientId
                        }
                    });

                enqueueSnackbar('Nytt bilde er lagret', {
                    variant: 'success'
                });
                return true;
            }
            enqueueSnackbar('Bilde ble ikke lagret', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av lokasjonsbilde', {
                variant: 'error'
            });
        }
        return false;
    };
    const saveDeleteLocationImage = async ({
        imageId,
        klientId,
        locationId
    }: {
        imageId: number;
        klientId: number;
        locationId: number;
    }): Promise<boolean> => {
        try {
            const { status } = await deleteImageFile(imageId);

            if (status === 204 && state.klienter) {
                const location = state.klienter
                    ?.find((k) => k.id === klientId)
                    ?.locations.find((l) => l.id === locationId);

                if (location)
                    dispatch({
                        type: ActionType.updateLocation,
                        payload: {
                            location: { ...location, locationImage: undefined },
                            klientId
                        }
                    });

                enqueueSnackbar('Bilde fjernet', {
                    variant: 'success'
                });
                return true;
            }
            enqueueSnackbar('Bilde ble ikke fjernet', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av lokasjon', {
                variant: 'error'
            });
        }
        return false;
    };

    return (
        <ClientContext.Provider
            value={{
                state
            }}>
            {children}
        </ClientContext.Provider>
    );
};
