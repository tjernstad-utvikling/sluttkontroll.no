import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import {
    editChecklist,
    toggleAktuellStatusChecklist
} from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

import { Checkpoint } from '../../contracts/checkpointApi';
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

                saveEditChecklist,
                toggleAktuellChecklist
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
