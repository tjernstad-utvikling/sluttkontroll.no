import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { Roles, User } from '../../contracts/userApi';
import {
    getUsers,
    newUser as newUserApi,
    updateByIdUser
} from '../../api/userApi';
import { initialState, userReducer } from './reducer';

import { errorHandler } from '../../tools/errorHandler';
import { useSnackbar } from 'notistack';

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

    const { enqueueSnackbar } = useSnackbar();

    const newUser = async (
        name: string,
        email: string,
        phone: string,
        roles: Roles[] | undefined
    ) => {
        try {
            const { status, user, message } = await newUserApi(
                name,
                email,
                phone,
                roles !== undefined ? roles : [Roles.ROLE_USER]
            );

            if (status === 200) {
                if (user !== undefined) {
                    dispatch({
                        type: ActionType.addUsers,
                        payload: [user]
                    });
                    enqueueSnackbar('Bruker er lagret', {
                        variant: 'success'
                    });
                    return true;
                }
            } else if (status === 400) {
                if (message === 'user_exists') {
                    enqueueSnackbar('Epostadressen er allerede registrert', {
                        variant: 'warning'
                    });
                } else if (message === 'user_data_missing') {
                    enqueueSnackbar('Epost eller navn mangler', {
                        variant: 'warning'
                    });
                }
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Ukjent feil ved lagring av profil', {
                variant: 'error'
            });
            console.error(error);
            return false;
        }
    };
    const updateUser = async (user: User) => {
        try {
            const { status, message } = await updateByIdUser(user);

            if (status === 204) {
                updateUserInState(user);
                enqueueSnackbar('Bruker er lagret', {
                    variant: 'success'
                });
                return true;
            } else if (status === 400) {
                if (message === 'user_exists') {
                    enqueueSnackbar(
                        'Epostadressen er allerede registrert på en annen bruker',
                        {
                            variant: 'warning'
                        }
                    );
                } else if (message === 'user_data_missing') {
                    enqueueSnackbar('Epost eller navn mangler', {
                        variant: 'warning'
                    });
                }
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Ukjent feil ved lagring av profil', {
                variant: 'error'
            });
            console.error(error);
            return false;
        }
    };

    const loadUsers = async (): Promise<void> => {
        if (!hasLoadedUsers) {
            try {
                const { status, users } = await getUsers();

                if (status === 200) {
                    dispatch({
                        type: ActionType.addUsers,
                        payload: users
                    });
                }
            } catch (error: any) {
                errorHandler(error);
            }
            setHasLoadedUsers(true);
        }
    };

    const updateUserInState = (user: User): void => {
        dispatch({
            type: ActionType.UpdateUser,
            payload: user
        });
    };

    return (
        <UserContext.Provider
            value={{
                state,

                loadUsers,
                updateUserInState,
                newUser,
                updateUser
            }}>
            {children}
        </UserContext.Provider>
    );
};
