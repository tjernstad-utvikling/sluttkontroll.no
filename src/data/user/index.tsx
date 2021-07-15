import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
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
    const [hasLoadedUsers, setHasLoadedUsers] = useState<boolean>(false);

    const loadUsers = async (): Promise<void> => {
        if (!hasLoadedUsers) {
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
            setHasLoadedUsers(true);
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
