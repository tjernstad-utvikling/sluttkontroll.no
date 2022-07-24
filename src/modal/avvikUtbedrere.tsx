import { AvvikUtbedrereSchema } from '../schema/avvikUtbedrere';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { User } from '../contracts/userApi';
import { useSetRectifier } from '../api/hooks/useAvvik';

interface AvvikUtbedrereModalProps {
    selectedAvvik: number[];
    close: () => void;
    open: boolean;
    kontrollId: number;
}

export const AvvikUtbedrereModal = ({
    selectedAvvik,
    close,
    open,
    kontrollId
}: AvvikUtbedrereModalProps): JSX.Element => {
    const rectifierMutation = useSetRectifier();
    const handleUpdate = async (utbedrer: User[] | null): Promise<boolean> => {
        try {
            rectifierMutation.mutateAsync({
                avvikIds: selectedAvvik,
                utbedrer: utbedrer !== null ? utbedrer : []
            });
        } catch (error) {
            console.log(error);
        } finally {
            close();
        }

        return false;
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog"
            fullWidth>
            <DialogTitle id="add-Picture-Dialog">
                Sett utbedrere for valgte avvik
            </DialogTitle>
            <DialogContent>
                <AvvikUtbedrereSchema
                    kontrollId={kontrollId}
                    onSubmit={handleUpdate}
                    selectedAvvik={selectedAvvik}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
};
