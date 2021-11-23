import { useEffect, useState } from 'react';

import { Avvik } from '../contracts/avvikApi';
import { AvvikSchema } from '../schema/avvik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { User } from '../contracts/userApi';
import { useAvvik } from '../data/avvik';

interface AvvikEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const AvvikEditModal = ({
    editId,
    close
}: AvvikEditModalProps): JSX.Element => {
    const [editAvvik, setEditAvvik] = useState<Avvik>();

    const {
        state: { avvik },
        updateAvvik
    } = useAvvik();

    useEffect(() => {
        if (avvik !== undefined) {
            setEditAvvik(avvik.find((a) => a.id === editId));
        }
    }, [editId, avvik]);

    const handleUpdate = async (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null
    ): Promise<boolean> => {
        if (editAvvik !== undefined) {
            if (
                await updateAvvik({
                    ...editAvvik,
                    beskrivelse,
                    kommentar,
                    utbedrer: utbedrer !== null ? utbedrer : []
                })
            ) {
                close();
            }
        }
        return false;
    };

    return (
        <Dialog
            open={Boolean(editId)}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">Rediger Avvik</DialogTitle>
            <DialogContent>
                {editAvvik && (
                    <AvvikSchema onSubmit={handleUpdate} avvik={editAvvik} />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
};
