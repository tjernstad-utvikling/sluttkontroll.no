import {
    useAddMeasurement,
    useMeasurementById,
    useUpdateMeasurement
} from '../api/hooks/useMeasurement';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { MeasurementSchema } from '../schema/measurement';
import { NewFormMeasurement } from '../contracts/measurementApi';

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
    const measurementData = useMeasurementById(editId);

    const newMeasurementMutation = useAddMeasurement();
    const updateMeasurementMutation = useUpdateMeasurement();

    const handleSave = async (
        measurementToSave: NewFormMeasurement
    ): Promise<boolean> => {
        if (editId !== undefined && measurementData.data !== undefined) {
            try {
                await updateMeasurementMutation.mutateAsync({
                    measurement: {
                        ...measurementData.data,
                        ...measurementToSave
                    }
                });
            } catch (error) {
            } finally {
                close();
                return true;
            }
        }
        if (
            measurementToSave !== undefined &&
            skjemaId !== undefined &&
            !isNaN(skjemaId)
        ) {
            try {
                await newMeasurementMutation.mutateAsync({
                    measurement: measurementToSave,
                    skjemaId
                });
            } catch (error) {
                console.log(error);
            } finally {
                close();
            }
        }
        return false;
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog"
            fullWidth>
            {measurementData.isLoading && <LinearProgress />}
            <DialogTitle id="add-Picture-Dialog">
                {editId !== undefined ? 'Rediger Måling' : 'Ny måling'}
            </DialogTitle>
            <DialogContent>
                {measurementData.data !== undefined || editId === undefined ? (
                    <MeasurementSchema
                        onSubmit={handleSave}
                        measurement={measurementData.data}
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
