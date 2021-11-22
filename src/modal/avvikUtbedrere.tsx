import { AvvikUtbedrereSchema } from '../schema/avvikUtbedrere';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { User } from '../contracts/userApi';
import { useAvvik } from '../data/avvik';

interface AvvikUtbedrereModalProps {
    selectedAvvik: number[];
    close: () => void;
    open: boolean;
}

export const AvvikUtbedrereModal = ({
    selectedAvvik,
    close,
    open
}: AvvikUtbedrereModalProps): JSX.Element => {
    const { setUtbedrere } = useAvvik();

    const handleUpdate = async (utbedrer: User[] | null): Promise<boolean> => {
        if (
            await setUtbedrere(selectedAvvik, utbedrer !== null ? utbedrer : [])
        ) {
            close();
        }
        return false;
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                Sett utbedrere for valgte avvik
            </DialogTitle>
            <DialogContent>
                <AvvikUtbedrereSchema
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
