import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer } from 'react';
import { initialState, userReducer } from './reducer';

import { getUsers } from '../../api/userApi';

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
        <UserContext.Provider
            value={{
                state,

                loadUsers
            }}>
            {children}
        </UserContext.Provider>
    );
};
