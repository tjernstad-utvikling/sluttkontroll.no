import { Roles, User } from '../contracts/userApi';
import { createContext, useContext, useState } from 'react';
import { getCurrentUser, getLogin } from '../api/auth';
import {
    updatePassword as updatePasswordApi,
    updateUser as updateUserApi
} from '../api/userApi';

import { StorageKeys } from '../contracts/keys';
import { refreshLoginToken } from '../api/sluttkontroll';
import { useSnackbar } from 'notistack';
import { useUser } from '../data/user';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useAuth = () => {
    return useContext(Context);
};

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [user, setUser] = useState<User>();
    const [hasCheckedLocal, setHasCheckedLocal] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const { updateUserInState } = useUser();

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ redirect: string; status: boolean }> => {
        const loginResponse = await getLogin(email, password);
        if (loginResponse.status === 200) {
            const userResponse = await getCurrentUser();
            if (
                userResponse.status === 200 &&
                userResponse.user !== undefined &&
                loginResponse.token !== undefined
            ) {
                setUser(userResponse.user);
                return {
                    redirect: redirectRole(userResponse.user),
                    status: true
                };
            }
        }
        return { redirect: '/', status: false };
    };

    const updateUser = async (
        name: string,
        email: string,
        phone: string,
        roles: Roles[] | undefined
    ) => {
        try {
            const { status } = await updateUserApi(
                name,
                email,
                phone,
                roles !== undefined ? roles : [Roles.ROLE_USER]
            );

            if (status === 204) {
                if (user !== undefined) {
                    const newRoles =
                        roles !== undefined ? roles : [Roles.ROLE_USER];

                    setUser({ ...user, name, email, phone, roles: newRoles });
                    updateUserInState({
                        ...user,
                        name,
                        email,
                        phone,
                        roles: newRoles
                    });
                    localStorage.setItem(
                        StorageKeys.currentUser,
                        JSON.stringify({
                            ...user,
                            name,
                            email,
                            phone,
                            roles: newRoles
                        })
                    );
                    enqueueSnackbar('Profil er oppdatert', {
                        variant: 'success'
                    });
                    return true;
                }
            } else if (status === 400) {
                enqueueSnackbar('Mangler ett eller flere felter', {
                    variant: 'warning'
                });
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

    const updatePassword = async (password: string) => {
        try {
            const { status } = await updatePasswordApi(password);

            if (status === 204) {
                enqueueSnackbar('Passord er endret', {
                    variant: 'success'
                });
                return true;
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Ukjent feil ved lagring av passord', {
                variant: 'error'
            });
            console.error(error);
            return false;
        }
    };

    const signOut = () => {
        setUser(undefined);
        localStorage.removeItem(StorageKeys.token);
        localStorage.removeItem(StorageKeys.refreshToken);
    };

    const loadUserFromStorage = async () => {
        const token = localStorage.getItem(StorageKeys.token);

        if (token !== null) {
            await refreshLoginToken();
            const jsonValue = localStorage.getItem(StorageKeys.currentUser);
            const currentUser: User =
                jsonValue != null ? JSON.parse(jsonValue) : undefined;
            setUser(currentUser);
            setHasCheckedLocal(true);
            return true;
        }
        setHasCheckedLocal(true);
        return false;
    };

    const userHasRole = (requiredRole: Roles): boolean => {
        if (user !== undefined) {
            if (user.roles.includes(requiredRole)) {
                return true;
            }
        }
        return false;
    };

    const redirectRole = (user: User): string => {
        if (user !== undefined) {
            if (
                user.roles.includes(Roles.ROLE_KONTROLL) ||
                user.roles.includes(Roles.ROLE_ADMIN)
            ) {
                return '/kontroll';
            }
        }

        return '/';
    };

    return (
        <Context.Provider
            value={{
                user,
                hasCheckedLocal,
                signIn,
                signOut,
                loadUserFromStorage,
                updateUser,
                userHasRole,
                updatePassword
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    user: User | undefined;
    hasCheckedLocal: boolean;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ redirect: string; status: boolean }>;
    signOut: () => void;
    loadUserFromStorage: () => Promise<boolean>;
    updateUser: (
        name: string,
        email: string,
        phone: string,
        roles: Roles[] | undefined
    ) => Promise<boolean>;
    userHasRole: (requiredRole: Roles) => boolean;
    updatePassword: (password: string) => Promise<boolean>;
}
