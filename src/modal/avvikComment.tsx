import { AvvikCommentSchema } from '../schema/avvikComment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAvvik } from '../data/avvik';

interface AvvikCommentModalProps {
    selectedAvvik: number[];
    open: boolean;
    close: () => void;
}

export const AvvikCommentModal = ({
    selectedAvvik,
    open,
    close
}: AvvikCommentModalProps): JSX.Element => {
    const { closeAvvik } = useAvvik();

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
            aria-labelledby="add-Picture-Dialog">
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
