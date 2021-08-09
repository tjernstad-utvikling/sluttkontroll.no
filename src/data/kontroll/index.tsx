import { ActionType, ContextInterface } from './contracts';
import {
    Klient,
    Kontroll,
    Location,
    Skjema
} from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    deleteSkjemaById,
    editChecklist,
    editClient,
    editLocation,
    getChecklistsBySkjema,
    getClients,
    getKontroller,
    getKontrollerByKlient,
    getKontrollerByObjekt,
    newClient,
    newKontroll,
    newLocation,
    newSkjema,
    toggleAktuellStatusChecklist,
    toggleKontrollStatus,
    updateKontroll as updateKontrollApi,
    updateSkjemaApi
} from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

import { Checkpoint } from '../../contracts/checkpointApi';
import { User } from '../../contracts/userApi';
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

    const { loadAvvikByKontroller } = useAvvik();
    const { loadMeasurementByKontroller } = useMeasurement();

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
    const loadKontroller = async (): Promise<void> => {
        if (!hasLoadedMyKontroller) {
            try {
                const { status, kontroller, skjemaer, checklists } =
                    await getKontroller();

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
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    const loadKontrollerByKlient = async (klientId: number): Promise<void> => {
        try {
            const { status, kontroller, skjemaer, checklists } =
                await getKontrollerByKlient(klientId);

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
        } catch (error) {
            console.log(error);
        }
    };
    const loadKontrollerByObjekt = async (objektId: number): Promise<void> => {
        try {
            const { status, kontroller, skjemaer, checklists } =
                await getKontrollerByObjekt(objektId);

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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            enqueueSnackbar('Problemer med oppdatering av skjema', {
                variant: 'error'
            });
        }
        return false;
    };

    const removeSkjema = async (skjemaId: number): Promise<boolean> => {
        try {
            const res = await deleteSkjemaById(skjemaId);
            console.log(res);
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
        } catch (error) {
            console.log(error);
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
        } catch (error) {
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
        } catch (error) {
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
                loadKlienter,
                saveNewKlient,
                saveEditKlient,
                updateKontroll,
                toggleStatusKontroll,
                saveNewKontroll,
                saveNewLocation,
                saveEditLocation,
                saveNewSkjema,
                updateSkjema,
                removeSkjema,
                saveEditChecklist,
                toggleAktuellChecklist
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
