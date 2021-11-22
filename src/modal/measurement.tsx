import { Measurement, NewFormMeasurement } from '../contracts/measurementApi';
import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MeasurementSchema } from '../schema/measurement';
import { useMeasurement } from '../data/measurement';

interface MeasurementModalProps {
    open: boolean;
    close: () => void;
    editId?: number | undefined;
    skjemaId?: number;
}

export const MeasurementModal = ({
    close,
    open,
    skjemaId,
    editId
}: MeasurementModalProps): JSX.Element => {
    const [measurement, setMeasurement] = useState<Measurement>();

    const {
        state: { measurements },
        saveNewMeasurement,
        updateMeasurement
    } = useMeasurement();

    useEffect(() => {
        if (measurements !== undefined && editId !== undefined) {
            setMeasurement(measurements.find((m) => m.id === editId));
        }
    }, [editId, measurements]);

    const handleSave = async (
        measurementToSave: NewFormMeasurement
    ): Promise<boolean> => {
        if (editId !== undefined && measurement !== undefined) {
            if (
                await updateMeasurement({
                    ...measurement,
                    ...measurementToSave
                })
            ) {
                close();
                return true;
            }
            return false;
        }
        if (
            measurementToSave !== undefined &&
            skjemaId !== undefined &&
            !isNaN(skjemaId)
        ) {
            if (await saveNewMeasurement(measurementToSave, skjemaId)) {
                close();
            }
        }
        return false;
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                {editId !== undefined ? 'Rediger Måling' : 'Ny måling'}
            </DialogTitle>
            <DialogContent>
                {measurement !== undefined || editId === undefined ? (
                    <MeasurementSchema
                        onSubmit={handleSave}
                        measurement={measurement}
                    />
                ) : (
                    <div />
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
