import { AvvikCommentSchema } from '../schema/avvikComment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface AvvikCommentModalProps {
    selectedAvvik: number[];
    open: boolean;
    close: () => void;
    closeAvvik: (
        selectedAvvik: number[],
        kommentar: string
    ) => Promise<boolean>;
}

export const AvvikCommentModal = ({
    selectedAvvik,
    open,
    close,
    closeAvvik
}: AvvikCommentModalProps): JSX.Element => {
    const handleUpdate = async (kommentar: string): Promise<boolean> => {
        if (await closeAvvik(selectedAvvik, kommentar)) {
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
                Kommentar til avvikene
            </DialogTitle>
            <DialogContent>
                <AvvikCommentSchema onSubmit={handleUpdate} />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
};
