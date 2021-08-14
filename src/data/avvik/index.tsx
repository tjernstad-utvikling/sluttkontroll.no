import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import {
    closeAvvikApi,
    deleteAvvikById,
    deleteImage,
    getAvvikByKontrollList,
    openAvvikApi,
    setUtbedrereApi,
    updateAvvikById
} from '../../api/avvikApi';
import { initialState, userReducer } from './reducer';

import { Avvik } from '../../contracts/avvikApi';
import { Kontroll } from '../../contracts/kontrollApi';
import { User } from '../../contracts/userApi';
import { useSnackbar } from 'notistack';

export const useAvvik = () => {
    return useContext(AvvikContext);
};

const AvvikContext = createContext<ContextInterface>({} as ContextInterface);

export const AvvikContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const { enqueueSnackbar } = useSnackbar();

    const loadAvvikByKontroller = async (
        kontroller: Kontroll[]
    ): Promise<void> => {
        try {
            const { status, avvik } = await getAvvikByKontrollList(
                kontroller.map((k) => k.id)
            );

            if (status === 200) {
                dispatch({
                    type: ActionType.addAvvik,
                    payload: avvik
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateAvvik = async (avvik: Avvik): Promise<boolean> => {
        try {
            const { status, message } = await updateAvvikById(avvik);

            if (status === 204) {
                dispatch({
                    type: ActionType.updateAvvik,
                    payload: avvik
                });
            }
            if (status === 400) {
                if (message === 'avvik closed') {
                    enqueueSnackbar('Avvik er lukket og kan ikke slettes', {
                        variant: 'warning'
                    });
                } else if (message === 'beskrivelse missing') {
                    enqueueSnackbar('Kan ikke lagre avviket uten beskrivelse', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Kan ikke oppdatere avviket', {
                        variant: 'warning'
                    });
                }
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med oppdatering av avvik', {
                variant: 'error'
            });
            return false;
        }
    };
    const setUtbedrere = async (
        avvik: Avvik[],
        utbedrere: User[]
    ): Promise<boolean> => {
        try {
            const { status } = await setUtbedrereApi(
                avvik.map((a) => a.id),
                utbedrere
            );

            if (status === 204) {
                avvik.forEach((a) => {
                    dispatch({
                        type: ActionType.updateAvvik,
                        payload: { ...a, utbedrer: utbedrere }
                    });
                });
                enqueueSnackbar('Utbedrere er satt', {
                    variant: 'success'
                });
            }
            return true;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med oppdatering av avvik', {
                variant: 'error'
            });
            return false;
        }
    };

    const closeAvvik = async (
        avvik: Avvik[],
        kommentar: string
    ): Promise<boolean> => {
        try {
            const { status } = await closeAvvikApi(
                avvik.map((a) => a.id),
                kommentar
            );

            if (status === 204) {
                avvik.forEach((a) => {
                    dispatch({
                        type: ActionType.updateAvvik,
                        payload: {
                            ...a,
                            status: 'lukket',
                            kommentar: `${a.kommentar} ${kommentar}`
                        }
                    });
                });
                enqueueSnackbar('Avvik er lukket', {
                    variant: 'success'
                });
            }
            return true;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med oppdatering av avvik', {
                variant: 'error'
            });
            return false;
        }
    };
    const openAvvik = async (avvikId: number): Promise<boolean> => {
        try {
            const { status } = await openAvvikApi(avvikId);

            const avvik = state.avvik?.find((a) => a.id === avvikId);
            if (status === 204 && avvik !== undefined) {
                dispatch({
                    type: ActionType.updateAvvik,
                    payload: {
                        ...avvik,
                        status: null
                    }
                });
                enqueueSnackbar('Avvik er åpnet', {
                    variant: 'success'
                });
            }
            return true;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med oppdatering av avvik', {
                variant: 'error'
            });
            return false;
        }
    };

    const deleteAvvik = async (avvikId: number): Promise<boolean> => {
        try {
            const { status, message } = await deleteAvvikById(avvikId);

            if (status === 204) {
                dispatch({
                    type: ActionType.deleteAvvik,
                    payload: { avvikId }
                });
            }

            if (status === 400) {
                if (message === 'avvik closed') {
                    enqueueSnackbar('Avvik er lukket og kan ikke slettes', {
                        variant: 'warning'
                    });
                } else if (message === 'avvik has images') {
                    enqueueSnackbar('Bilder må slettes før avviket', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Kan ikke slette avviket', {
                        variant: 'warning'
                    });
                }
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med sletting av avvik', {
                variant: 'error'
            });
            return false;
        }
    };

    const deleteAvvikImage = async (
        avvik: Avvik,
        imageId: number
    ): Promise<boolean> => {
        try {
            const { status } = await deleteImage(imageId);

            if (status === 204) {
                enqueueSnackbar('Bilde er slettet', {
                    variant: 'success'
                });
                dispatch({
                    type: ActionType.updateAvvik,
                    payload: {
                        ...avvik,
                        avvikBilder: avvik.avvikBilder.filter(
                            (ab) => ab.id !== imageId
                        )
                    }
                });
                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Problemer med sletting av bilde', {
                variant: 'error'
            });
            return false;
        }
    };

    return (
        <AvvikContext.Provider
            value={{
                state,

                loadAvvikByKontroller,
                deleteAvvik,
                updateAvvik,
                setUtbedrere,
                closeAvvik,
                openAvvik,
                deleteAvvikImage
            }}>
            {children}
        </AvvikContext.Provider>
    );
};
