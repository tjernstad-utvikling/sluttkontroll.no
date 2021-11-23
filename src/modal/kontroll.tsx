import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Kontroll } from '../contracts/kontrollApi';
import { KontrollSchema } from '../schema/kontroll';
import { User } from '../contracts/userApi';
import { useKontroll } from '../data/kontroll';

interface KontrollEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const KontrollEditModal = ({
    editId,
    close
}: KontrollEditModalProps): JSX.Element => {
    const [kontroll, setKontroll] = useState<Kontroll>();

    const {
        state: { kontroller },
        updateKontroll
    } = useKontroll();

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroll(kontroller.find((k) => k.id === editId));
        }
    }, [editId, kontroller]);

    const handleUpdate = async (
        name: string,
        user: User,
        avvikUtbedrere: User[] | null
    ): Promise<boolean> => {
        if (kontroll !== undefined) {
            if (
                await updateKontroll({
                    ...kontroll,
                    name,
                    user,
                    avvikUtbedrere:
                        avvikUtbedrere !== null ? avvikUtbedrere : []
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
            aria-labelledby="add-Picture-Dialog"
            fullWidth>
            <DialogTitle id="add-Picture-Dialog">Rediger kontroll</DialogTitle>
            <DialogContent>
                {kontroll && (
                    <KontrollSchema
                        onSubmit={handleUpdate}
                        kontroll={kontroll}
                    />
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
