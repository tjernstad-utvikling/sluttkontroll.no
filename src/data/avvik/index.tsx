import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import { initialState, userReducer } from './reducer';

import { Kontroll } from '../../contracts/kontrollApi';
import { getAvvikByKontrollList } from '../../api/avvikApi';

export const useUser = () => {
    return useContext(UserContext);
};

const UserContext = createContext<ContextInterface>({} as ContextInterface);

export const UserContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(userReducer, initialState);

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

    return (
        <UserContext.Provider
            value={{
                state,

                loadAvvikByKontroller
            }}>
            {children}
        </UserContext.Provider>
    );
};
