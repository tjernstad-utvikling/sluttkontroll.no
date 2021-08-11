import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import { deleteAvvikById, getAvvikByKontrollList } from '../../api/avvikApi';
import { initialState, userReducer } from './reducer';

import { Kontroll } from '../../contracts/kontrollApi';
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

    return (
        <AvvikContext.Provider
            value={{
                state,

                loadAvvikByKontroller,
                deleteAvvik
            }}>
            {children}
        </AvvikContext.Provider>
    );
};
