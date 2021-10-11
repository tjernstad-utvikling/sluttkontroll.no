import { createContext, useContext, useRef, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ConfirmContext = createContext<ContextInterface>({} as ContextInterface);

export const useConfirm = () => {
    return useContext(ConfirmContext);
};
export const ConfirmationDialogProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);
    const [dialogText, setDialogText] = useState<string>('');
    const resolveCallback =
        useRef<(value: boolean | PromiseLike<boolean>) => void>();

    const onConfirm = () => {
        closeConfirm();
        if (resolveCallback.current !== undefined)
            resolveCallback.current(true);
    };

    const onDismiss = () => {
        closeConfirm();
        if (resolveCallback.current !== undefined)
            resolveCallback.current(false);
    };
    const confirm = (text: string) => {
        setShow(true);
        setDialogText(text);

        return new Promise<boolean>((res, rej) => {
            resolveCallback.current = res;
        });
    };

    const closeConfirm = () => {
        setShow(false);
    };

    return (
        <ConfirmContext.Provider
            value={{
                confirm
            }}>
            <ConfirmationDialog
                open={show}
                message={dialogText}
                onConfirm={onConfirm}
                onDismiss={onDismiss}
            />
            {children}
        </ConfirmContext.Provider>
    );
};

export interface ContextInterface {
    confirm: (text: string) => Promise<boolean>;
}
interface ConfirmationDialogProps {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onDismiss: () => void;
}
const ConfirmationDialog = ({
    open,
    message,
    onConfirm,
    onDismiss
}: ConfirmationDialogProps) => {
    return (
        <Dialog open={open} onClose={onDismiss}>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
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
