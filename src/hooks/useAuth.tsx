import { createContext, useContext, useState } from 'react';
import { getCurrentUser, getLogin } from '../api/auth';

import { StorageKeys } from '../contracts/keys';
import { User } from '../contracts/userApi';
import { refreshLoginToken } from '../api/sluttkontroll';

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

    const signIn = async (
        email: string,
        password: string
    ): Promise<boolean> => {
        const loginResponse = await getLogin(email, password);
        if (loginResponse.status === 200) {
            const userResponse = await getCurrentUser();
            if (
                userResponse.status === 200 &&
                userResponse.user !== undefined &&
                loginResponse.token !== undefined
            ) {
                setUser(userResponse.user);
                return true;
            }
        }
        return false;
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

    return (
        <Context.Provider
            value={{
                user,
                hasCheckedLocal,
                signIn,
                signOut,
                loadUserFromStorage
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    user: User | undefined;
    hasCheckedLocal: boolean;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => void;
    loadUserFromStorage: () => Promise<boolean>;
}
