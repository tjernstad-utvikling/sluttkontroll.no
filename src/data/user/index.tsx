import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import { initialState, kontrollReducer } from './reducer';

import { getUsers } from '../../api/userApi';

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

    const loadUsers = async (): Promise<void> => {
        try {
            const { status, users } = await getUsers();

            if (status === 200) {
                dispatch({
                    type: ActionType.setUsers,
                    payload: users
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

                loadUsers
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
