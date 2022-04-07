import { useAvvikById, useUpdateAvvik } from '../api/hooks/useAvvik';

import { AvvikSchema } from '../schema/avvik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { User } from '../contracts/userApi';

interface AvvikEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const AvvikEditModal = ({
    editId,
    close
}: AvvikEditModalProps): JSX.Element => {
    const avvikData = useAvvikById(editId);

    const updateAvvikMutation = useUpdateAvvik();
    const handleUpdate = async (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null
    ): Promise<boolean> => {
        if (avvikData.data !== undefined) {
            try {
                updateAvvikMutation.mutateAsync({
                    avvik: {
                        ...avvikData.data,
                        beskrivelse,
                        kommentar,
                        utbedrer: utbedrer !== null ? utbedrer : []
                    }
                });
            } catch (error) {
                console.log(error);
            } finally {
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
            {avvikData.isLoading && <LinearProgress />}
            <DialogTitle id="add-Picture-Dialog">Rediger Avvik</DialogTitle>
            <DialogContent>
                {avvikData.isFetched && (
                    <AvvikSchema
                        onSubmit={handleUpdate}
                        avvik={avvikData.data}
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
