import { AvvikCommentSchema } from '../schema/avvikComment';
import Modal from '@mui/material/Modal';
import { useAvvik } from '../data/avvik';
import { useModalStyles } from '../styles/modal';

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
    const classes = useModalStyles();

    const { closeAvvik } = useAvvik();

    const handleUpdate = async (kommentar: string): Promise<boolean> => {
        if (await closeAvvik(selectedAvvik, kommentar)) {
            close();
        }

        return false;
    };

    return (
        <Modal open={open} onClose={close} aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">Kommentar til avvikene</h2>
                <AvvikCommentSchema onSubmit={handleUpdate} />
            </div>
        </Modal>
    );
};
