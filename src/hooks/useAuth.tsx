import { Roles, User } from '../contracts/userApi';
import { createContext, useContext, useState } from 'react';
import {
    getCurrentUser,
    getLogin,
    logoutAll as logoutAllApi
} from '../api/authApi';
import {
    updatePassword as updatePasswordApi,
    updateUser as updateUserApi
} from '../api/userApi';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
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

    const [show, setShow] = useState<boolean>(false);

    const [logoutAll, setLogoutAll] = useState<boolean>(false);

    const onDismiss = () => {
        setShow(false);
    };

    const confirmLogout = async () => {
        if (logoutAll) {
            try {
                await logoutAllApi();
            } catch (error) {
                enqueueSnackbar('Kunne ikke logge ut av andre enheter', {
                    variant: 'warning'
                });
            }
        }
        localStorage.removeItem(StorageKeys.token);
        localStorage.removeItem(StorageKeys.refreshToken);
        localStorage.removeItem(StorageKeys.currentUser);
        setUser(undefined);
        setShow(false);
    };

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
        setShow(true);
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

    const userHasRole = (requiredRole: Roles[]): boolean => {
        if (user !== undefined) {
            if (user.roles.some((r) => requiredRole.includes(r))) {
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
            } else if (user.roles.includes(Roles.ROLE_LUKKE_AVVIK)) {
                return '/external';
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
            <ConfirmationDialog
                open={show}
                logoutAll={logoutAll}
                setLogoutAll={setLogoutAll}
                onConfirm={confirmLogout}
                onDismiss={onDismiss}
            />
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
    userHasRole: (requiredRole: Roles[]) => boolean;
    updatePassword: (password: string) => Promise<boolean>;
}

interface ConfirmationDialogProps {
    open: boolean;
    logoutAll: boolean;
    setLogoutAll: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
    onDismiss: () => void;
}
const ConfirmationDialog = ({
    open,
    logoutAll,
    setLogoutAll,
    onConfirm,
    onDismiss
}: ConfirmationDialogProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogoutAll(event.target.checked);
    };
    return (
        <Dialog open={open} onClose={onDismiss}>
            <DialogContent>
                <DialogContentText>Klikk OK for å logge ut</DialogContentText>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={logoutAll}
                                onChange={handleChange}
                            />
                        }
                        label={
                            <DialogContentText>
                                Velg for å logge ut fra andre enheter også
                            </DialogContentText>
                        }
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss}>Avbryt</Button>
                <Button
                    autoFocus
                    color="primary"
                    variant="contained"
                    onClick={onConfirm}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};
