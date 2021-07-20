import { MeasurementSchema } from '../schema/measurement';
import Modal from '@material-ui/core/Modal';
import { NewFormMeasurement } from '../contracts/measurementApi';
import { useMeasurement } from '../data/measurement';
import { useModalStyles } from '../styles/modal';

interface MeasurementModalProps {
    open: boolean;
    close: () => void;
    skjemaId?: number;
}

export const MeasurementModal = ({
    close,
    open,
    skjemaId
}: MeasurementModalProps): JSX.Element => {
    const classes = useModalStyles();

    const { saveNewMeasurement } = useMeasurement();

    const handleSave = async (
        measurement: NewFormMeasurement
    ): Promise<boolean> => {
        if (
            measurement !== undefined &&
            skjemaId !== undefined &&
            !isNaN(skjemaId)
        ) {
            if (await saveNewMeasurement(measurement, skjemaId)) {
                close();
            }
        }
        return false;
    };

    return (
        <Modal open={open} onClose={close} aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">Ny måling</h2>

                <MeasurementSchema onSubmit={handleSave} />
            </div>
        </Modal>
    );
};
