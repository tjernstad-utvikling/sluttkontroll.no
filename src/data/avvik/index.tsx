import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import {
    addAvvikApi,
    addImage,
    deleteAvvikById,
    deleteImage,
    openAvvikApi
} from '../../api/avvikApi';
import { initialState, userReducer } from './reducer';

import { Avvik } from '../../contracts/avvikApi';
import { User } from '../../contracts/userApi';
import { errorHandler } from '../../tools/errorHandler';
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

    const newAvvik = async (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null,
        checklistId: number
    ): Promise<Avvik | false> => {
        try {
            const { status, avvik } = await addAvvikApi({
                beskrivelse,
                kommentar,
                utbedrer,
                checklistId
            });

            if (status === 200) {
                dispatch({
                    type: ActionType.addAvvik,
                    payload: [avvik]
                });
                enqueueSnackbar('Nytt avvik lagret', {
                    variant: 'success'
                });
                return avvik;
            }
            return false;
        } catch (error: any) {
            errorHandler(error);
            enqueueSnackbar('Problemer med lagring av avvik', {
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
        } catch (error: any) {
            errorHandler(error);
            enqueueSnackbar('Problemer med sletting av bilde', {
                variant: 'error'
            });
            return false;
        }
    };
    const addAvvikImages = async (
        avvik: Avvik,
        images: File[]
    ): Promise<boolean> => {
        try {
            const { status, avvikBilder, message } = await addImage(
                avvik.id,
                images
            );
            if (status === 200 && avvikBilder !== undefined) {
                dispatch({
                    type: ActionType.updateAvvik,
                    payload: {
                        ...avvik,
                        avvikBilder: [...avvik.avvikBilder, ...avvikBilder]
                    }
                });

                enqueueSnackbar('Bilder er lastet opp', {
                    variant: 'success'
                });
                return true;
            } else if (status === 400 && message === 'missing file') {
                enqueueSnackbar(
                    'Bildet mangler ved opplastning, prøv igjen eller kontakt support',
                    {
                        variant: 'warning'
                    }
                );
            } else if (status === 400) {
                enqueueSnackbar('Ukjent feil ved opplastning', {
                    variant: 'warning'
                });
            }
        } catch (error: any) {
            enqueueSnackbar('Problemer med opplastning av bilde', {
                variant: 'error'
            });
        }

        return false;
    };

    return (
        <AvvikContext.Provider
            value={{
                state,

                newAvvik,
                deleteAvvikImage,
                addAvvikImages
            }}>
            {children}
        </AvvikContext.Provider>
    );
};
