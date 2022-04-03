import { ActionType, ContextInterface } from './contracts';
import { Kontroll, Location, Skjema } from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    deleteSkjemaById,
    editChecklist,
    getChecklistsBySkjema,
    getKontroller,
    getKontrollerByKlient,
    getKontrollerByObjekt,
    moveKontrollApi,
    moveSkjemaApi,
    newKontroll,
    newSkjema,
    toggleAktuellStatusChecklist,
    toggleKontrollStatus,
    updateKontroll as updateKontrollApi,
    updateSkjemaApi
} from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

import { Checkpoint } from '../../contracts/checkpointApi';
import { User } from '../../contracts/userApi';
import { errorHandler } from '../../tools/errorHandler';
import { useAvvik } from '../avvik';
import { useMeasurement } from '../measurement';
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

    const [hasLoadedMyKontroller, setHasLoadedMyKontroller] =
        useState<boolean>(false);
    const [hasLoadedAllMyKontroller, setHasLoadedAllMyKontroller] =
        useState<boolean>(false);

    const [showAllKontroller, setShowAllKontroller] = useState<boolean>(false);

    const { loadAvvikByKontroller } = useAvvik();
    const { loadMeasurementByKontroller } = useMeasurement();

    const { enqueueSnackbar } = useSnackbar();

    const loadKontroller = async (queryAll?: boolean): Promise<void> => {
        if (!hasLoadedMyKontroller || (queryAll && !hasLoadedAllMyKontroller)) {
            try {
                const { status, kontroller, skjemaer, checklists } =
                    await getKontroller(queryAll);

                loadAvvikByKontroller(kontroller);
                loadMeasurementByKontroller(kontroller);

                if (status === 200) {
                    dispatch({
                        type: ActionType.addKontroller,
                        payload: kontroller
                    });
                    dispatch({
                        type: ActionType.addSkjemaer,
                        payload: skjemaer
                    });
                    dispatch({
                        type: ActionType.addChecklists,
                        payload: checklists
                    });
                    setHasLoadedMyKontroller(true);
                    if (queryAll) {
                        setHasLoadedAllMyKontroller(true);
                    }
                }
            } catch (error: any) {
                errorHandler(error);
            }
        }
    };
    const loadKontrollerByKlient = async (
        klientId: number,
        queryAll?: boolean
    ): Promise<void> => {
        try {
            const { status, kontroller, skjemaer, checklists } =
                await getKontrollerByKlient(klientId, queryAll);

            loadAvvikByKontroller(kontroller);
            loadMeasurementByKontroller(kontroller);

            if (status === 200) {
                dispatch({
                    type: ActionType.addKontroller,
                    payload: kontroller
                });
                dispatch({
                    type: ActionType.addSkjemaer,
                    payload: skjemaer
                });
                dispatch({
                    type: ActionType.addChecklists,
                    payload: checklists
                });
            }
        } catch (error: any) {
            errorHandler(error);
        }
    };
    const loadKontrollerByObjekt = async (
        objektId: number,
        queryAll?: boolean
    ): Promise<boolean> => {
        try {
            const { status, kontroller, skjemaer, checklists } =
                await getKontrollerByObjekt(objektId, queryAll);

            await loadAvvikByKontroller(kontroller);
            loadMeasurementByKontroller(kontroller);

            if (status === 200) {
                dispatch({
                    type: ActionType.addKontroller,
                    payload: kontroller
                });
                dispatch({
                    type: ActionType.addSkjemaer,
                    payload: skjemaer
                });
                dispatch({
                    type: ActionType.addChecklists,
                    payload: checklists
                });
                return true;
            }
            return false;
        } catch (error: any) {
            errorHandler(error);
            return false;
        }
    };

    const updateKontroll = async (kontroll: Kontroll): Promise<boolean> => {
        try {
            const { status } = await updateKontrollApi(kontroll);

            if (status === 204) {
                dispatch({
                    type: ActionType.updateKontroll,
                    payload: kontroll
                });

                enqueueSnackbar('Kontroll oppdatert', {
                    variant: 'success'
                });
                return true;
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med oppdatering av kontrollen', {
                variant: 'error'
            });
        }
        return false;
    };

    const moveKontroll = async (
        kontroll: Kontroll,
        klientId: number,
        locationId: number
    ): Promise<boolean> => {
        try {
            const { status } = await moveKontrollApi(kontroll, locationId);

            if (status === 204) {
                dispatch({
                    type: ActionType.updateKontroll,
                    payload: {
                        ...kontroll,
                        location: { id: locationId, klient: { id: klientId } }
                    }
                });

                enqueueSnackbar('Kontroll er flyttet', {
                    variant: 'success'
                });
                return true;
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med flytting av kontrollen', {
                variant: 'error'
            });
        }
        return false;
    };

    const toggleStatusKontroll = async (
        kontrollId: number
    ): Promise<boolean> => {
        try {
            const resStatus = await toggleKontrollStatus(kontrollId);

            const kontroll = state.kontroller?.find((k) => k.id === kontrollId);
            if (resStatus === 204 && kontroll !== undefined) {
                dispatch({
                    type: ActionType.updateKontroll,
                    payload: { ...kontroll, done: !kontroll.done }
                });

                enqueueSnackbar('Kontroll satt som utført', {
                    variant: 'success'
                });
            }
            return true;
        } catch (error: any) {
            enqueueSnackbar('Problemer med oppdatering av kontrollen', {
                variant: 'error'
            });
        }
        return false;
    };
    const saveNewKontroll = async (
        name: string,
        avvikUtbedrere: Array<User>,
        location: Location,
        user: User
    ): Promise<boolean> => {
        try {
            const res = await newKontroll(name, avvikUtbedrere, location, user);

            dispatch({
                type: ActionType.updateKontroll,
                payload: res.kontroll
            });

            enqueueSnackbar('Kontroll lagret', {
                variant: 'success'
            });
            return true;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av kontrollen', {
                variant: 'error'
            });
        }
        return false;
    };
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

                loadKontroller,
                loadKontrollerByKlient,
                loadKontrollerByObjekt,
                showAllKontroller,
                setShowAllKontroller,

                moveKontroll,
                toggleStatusKontroll,
                saveNewKontroll,

                saveNewSkjema,
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
