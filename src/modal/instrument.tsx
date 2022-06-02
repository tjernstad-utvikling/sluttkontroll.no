import {
    useAddInstrument,
    useInstrument,
    useUpdateInstrument
} from '../api/hooks/useInstrument';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { InstrumentSchema } from '../schema/instrument';
import { User } from '../contracts/userApi';

interface InstrumentModalProps {
    editId: number | undefined;
    open: boolean;
    close: () => void;
}
export function InstrumentModal({ open, close, editId }: InstrumentModalProps) {
    const instrumentData = useInstrument({ instrumentId: editId });

    const addInstrumentMutation = useAddInstrument();
    const updateInstrumentMutation = useUpdateInstrument();

    const handleInstrumentSubmit = async (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ): Promise<boolean> => {
        if (editId === undefined) {
            try {
                await addInstrumentMutation.mutateAsync({
                    name,
                    serienr,
                    user,
                    toCalibrate,
                    calibrationInterval
                });
            } catch (error) {
                console.log(error);
            } finally {
                close();
                return true;
            }
        } else if (instrumentData.data !== undefined) {
            try {
                await updateInstrumentMutation.mutateAsync({
                    instrument: {
                        ...instrumentData.data,
                        name,
                        serienr,
                        user,
                        toCalibrate,
                        calibrationInterval
                    }
                });
            } catch (error) {
                console.log(error);
            } finally {
                close();
                return true;
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
            <DialogTitle id="add-Picture-Dialog">
                {editId === undefined ? 'Nytt' : 'Rediger'} instrument{' '}
            </DialogTitle>
            <DialogContent>
                {instrumentData.data && (
                    <InstrumentSchema
                        onSubmit={handleInstrumentSubmit}
                        instrument={instrumentData.data}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
}
