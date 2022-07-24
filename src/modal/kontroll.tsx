import { useKontrollById, useUpdateKontroll } from '../api/hooks/useKontroll';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { KontrollSchema } from '../schema/kontroll';
import { User } from '../contracts/userApi';

interface KontrollEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const KontrollEditModal = ({
    editId,
    close
}: KontrollEditModalProps): JSX.Element => {
    const kontrollData = useKontrollById(editId);

    const updateMutation = useUpdateKontroll();

    const handleUpdate = async (
        name: string,
        user: User,
        avvikUtbedrere: User[] | null
    ): Promise<boolean> => {
        if (kontrollData.data !== undefined) {
            if (
                await updateMutation.mutateAsync({
                    ...kontrollData.data,
                    name,
                    user,
                    avvikUtbedrere: avvikUtbedrere ?? []
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
                {kontrollData.data && (
                    <KontrollSchema
                        onSubmit={handleUpdate}
                        kontroll={kontrollData.data}
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
