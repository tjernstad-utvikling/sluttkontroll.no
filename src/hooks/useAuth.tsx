import { Roles, User } from '../contracts/userApi';
import { createContext, useContext, useState } from 'react';
import {
    getCurrentUser,
    getLogin,
    logoutAll as logoutAllApi
} from '../api/authApi';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { StorageKeys } from '../contracts/keys';
import { updatePassword as updatePasswordApi } from '../api/userApi';
import { useCurrentUser } from '../api/hooks/useUsers';
import { useSnackbar } from 'notistack';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useAuth = () => {
    return useContext(Context);
};

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const currentUserData = useCurrentUser();

    const { enqueueSnackbar } = useSnackbar();

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
                return {
                    redirect: redirectRole(userResponse.user),
                    status: true
                };
            }
        }
        return { redirect: '/', status: false };
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

    const userHasRole = (requiredRole: Roles[]): boolean => {
        if (currentUserData.data !== undefined) {
            if (
                currentUserData.data.roles.some((r) => requiredRole.includes(r))
            ) {
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
                return '/external/avvik';
            }
        }

        return '/';
    };

    return (
        <Context.Provider
            value={{
                signIn,
                signOut,
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
    signIn: (
        email: string,
        password: string
    ) => Promise<{ redirect: string; status: boolean }>;
    signOut: () => void;
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
