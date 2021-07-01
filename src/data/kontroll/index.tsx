import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import { initialState, kontrollReducer } from './reducer';

import { getClients } from '../../api/kontrollApi';

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
            const klienter = await getClients();

            if (klienter !== undefined) {
                dispatch({
                    type: ActionType.setKlienter,
                    payload: klienter
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

                loadKlienter
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
