import { Avvik } from '../contracts/avvikApi';
import { AvvikUtbedrereSchema } from '../schema/avvikUtbedrere';
import Modal from '@mui/material/Modal';
import { User } from '../contracts/userApi';
import { useAvvik } from '../data/avvik';
import { useModalStyles } from '../styles/modal';

interface AvvikUtbedrereModalProps {
    selectedAvvik: Avvik[];
    close: () => void;
    open: boolean;
}

export const AvvikUtbedrereModal = ({
    selectedAvvik,
    close,
    open
}: AvvikUtbedrereModalProps): JSX.Element => {
    const classes = useModalStyles();

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
        <Modal open={open} onClose={close} aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">Sett utbedrere for valgte avvik</h2>

                <AvvikUtbedrereSchema
                    onSubmit={handleUpdate}
                    selectedAvvik={selectedAvvik}
                />
            </div>
        </Modal>
    );
};
