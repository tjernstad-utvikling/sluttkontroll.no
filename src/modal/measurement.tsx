import { MeasurementSchema } from '../schema/measurement';
import Modal from '@material-ui/core/Modal';
import { useModalStyles } from '../styles/modal';

interface MeasurementModalProps {
    open: boolean;
    close: () => void;
}

export const MeasurementModal = ({
    close,
    open
}: MeasurementModalProps): JSX.Element => {
    const classes = useModalStyles();

    // const handleSave = async (
    //     name: string,
    //     user: User,
    //     avvikUtbedrere: User[] | null
    // ): Promise<boolean> => {
    //     if (kontroll !== undefined) {
    //         if (
    //             await updateKontroll({
    //                 ...kontroll,
    //                 name,
    //                 user,
    //                 avvikUtbedrere:
    //                     avvikUtbedrere !== null ? avvikUtbedrere : []
    //             })
    //         ) {
    //             close();
    //         }
    //     }
    //     return false;
    // };

    return (
        <Modal open={open} onClose={close} aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">Ny måling</h2>

                <MeasurementSchema />
            </div>
        </Modal>
    );
};
