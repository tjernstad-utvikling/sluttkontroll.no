import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import { getClients, getKontroller } from '../../api/kontrollApi';
import { initialState, kontrollReducer } from './reducer';

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

    return (
        <KontrollContext.Provider
            value={{
                state,

                loadKontroller,
                loadKlienter
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
