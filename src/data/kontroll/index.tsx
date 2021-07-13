import { ActionType, ContextInterface } from './contracts';
import { Klient, Kontroll, Location } from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    editChecklist,
    getChecklistsBySkjema,
    getClients,
    getKontroller,
    newClient,
    newKontroll,
    newLocation,
    newSkjema,
    updateKontroll as updateKontrollApi
} from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

import { Checkpoint } from '../../contracts/checkpointApi';
import { User } from '../../contracts/userApi';
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

    return (
        <KontrollContext.Provider
            value={{
                state,

                loadKontroller,
                loadKlienter,
                saveNewKlient,
                updateKontroll,
                saveNewKontroll,
                saveNewLocation,
                saveNewSkjema,
                saveEditChecklist
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
