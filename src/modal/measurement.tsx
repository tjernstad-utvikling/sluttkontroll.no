import { Measurement, NewFormMeasurement } from '../contracts/measurementApi';
import { useEffect, useState } from 'react';

import { MeasurementSchema } from '../schema/measurement';
import Modal from '@material-ui/core/Modal';
import { useMeasurement } from '../data/measurement';
import { useModalStyles } from '../styles/modal';

interface MeasurementModalProps {
    open: boolean;
    close: () => void;
    editId?: number;
    skjemaId?: number;
}

export const MeasurementModal = ({
    close,
    open,
    skjemaId,
    editId
}: MeasurementModalProps): JSX.Element => {
    const classes = useModalStyles();

    const [measurement, setMeasurement] = useState<Measurement>();

    const {
        state: { measurements },
        saveNewMeasurement
    } = useMeasurement();

    useEffect(() => {
        if (measurements !== undefined && editId !== undefined) {
            setMeasurement(measurements.find((m) => m.id === editId));
        }
    }, [editId, measurements]);

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
                <h2 id="modal-title">
                    {editId !== undefined ? 'Rediger Måling' : 'Ny måling'}
                </h2>

                <MeasurementSchema onSubmit={handleSave} />
            </div>
        </Modal>
    );
};
