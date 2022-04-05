import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import {
    deleteSkjemaById,
    editChecklist,
    getChecklistsBySkjema,
    moveSkjemaApi,
    newSkjema,
    toggleAktuellStatusChecklist,
    updateSkjemaApi
} from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

import { Checkpoint } from '../../contracts/checkpointApi';
import { Skjema } from '../../contracts/kontrollApi';
import { errorHandler } from '../../tools/errorHandler';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

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

    const [showAllKontroller, setShowAllKontroller] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const saveNewSkjema = async (
        area: string,
        omrade: string,
        checkpoints: Checkpoint[],
        kontrollId: number
    ): Promise<boolean> => {
        try {
            const res = await newSkjema(
                area,
                omrade,
                checkpoints.map((c) => c.id),
                kontrollId
            );
            if (res.status === 200) {
                const clRes = await getChecklistsBySkjema(res.skjema);

                dispatch({
                    type: ActionType.addChecklists,
                    payload: clRes.checklists
                });
            }

            dispatch({
                type: ActionType.newSkjema,
                payload: res.skjema
            });

            enqueueSnackbar('Skjema lagret', {
                variant: 'success'
            });
            return true;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av skjema', {
                variant: 'error'
            });
        }
        return false;
    };

    const updateSkjema = async (skjema: Skjema): Promise<boolean> => {
        try {
            const res = await updateSkjemaApi(skjema);

            if (res.status === 204) {
                dispatch({
                    type: ActionType.updateSkjema,
                    payload: skjema
                });

                enqueueSnackbar('Skjema oppdatert', {
                    variant: 'success'
                });
                return true;
            }
            if (res.status === 400) {
                enqueueSnackbar(
                    'Areal eller området mangler, se at alle felter er fylt ut',
                    {
                        variant: 'warning'
                    }
                );
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med oppdatering av skjema', {
                variant: 'error'
            });
        }
        return false;
    };
    const moveSkjema = async (
        skjema: Skjema,
        kontrollId: number
    ): Promise<boolean> => {
        try {
            const res = await moveSkjemaApi(skjema, kontrollId);

            if (res.status === 204) {
                dispatch({
                    type: ActionType.updateSkjema,
                    payload: { ...skjema, kontroll: { id: kontrollId } }
                });

                enqueueSnackbar('Skjema er flyttet', {
                    variant: 'success'
                });
                return true;
            }
            if (res.status === 400) {
                enqueueSnackbar('Kontroll eller skjema mangler, prøv igjen', {
                    variant: 'warning'
                });
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med flytting av skjema', {
                variant: 'error'
            });
        }
        return false;
    };

    const removeSkjema = async (skjemaId: number): Promise<boolean> => {
        try {
            const res = await deleteSkjemaById(skjemaId);
            if (res.status === 204) {
                dispatch({
                    type: ActionType.removeSkjema,
                    payload: { skjemaId }
                });
                enqueueSnackbar('Skjema slettet', {
                    variant: 'success'
                });
            }
            if (res.status === 400) {
                enqueueSnackbar('Avvik og måleresultater må slettes først', {
                    variant: 'warning'
                });
            }

            return true;
        } catch (error: any) {
            errorHandler(error);
            enqueueSnackbar('Problemer med sletting av skjema', {
                variant: 'error'
            });
        }
        return false;
    };

    const saveEditChecklist = async (
        skjemaId: number,
        checkpoints: Checkpoint[]
    ): Promise<boolean> => {
        try {
            const res = await editChecklist(
                checkpoints.map((c) => c.id),
                skjemaId
            );

            dispatch({
                type: ActionType.editChecklists,
                payload: { skjemaId, checklists: res.checklists }
            });

            enqueueSnackbar('Sjekkliste lagret', {
                variant: 'success'
            });
            return true;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av sjekkliste', {
                variant: 'error'
            });
        }
        return false;
    };

    const toggleAktuellChecklist = async (
        checklistId: number
    ): Promise<boolean> => {
        try {
            const checklist = state.checklists?.find(
                (c) => c.id === checklistId
            );
            if (checklist !== undefined) {
                await toggleAktuellStatusChecklist(
                    checklistId,
                    !checklist.aktuell
                );

                dispatch({
                    type: ActionType.updateChecklist,
                    payload: { ...checklist, aktuell: !checklist.aktuell }
                });

                enqueueSnackbar('Sjekkliste lagret', {
                    variant: 'success'
                });
                return true;
            }
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av sjekkliste', {
                variant: 'error'
            });
        }
        return false;
    };

    return (
        <KontrollContext.Provider
            value={{
                state,

                showAllKontroller,
                setShowAllKontroller,

                updateSkjema,
                moveSkjema,
                removeSkjema,
                saveEditChecklist,
                toggleAktuellChecklist
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
