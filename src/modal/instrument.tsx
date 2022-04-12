import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { InstrumentSchema } from '../schema/instrument';
import { User } from '../contracts/userApi';
import { useInstrument } from '../api/hooks/useInstrument';

interface InstrumentModalProps {
    editId: number | undefined;
    open: boolean;
    close: () => void;
}
export function InstrumentModal({ open, close, editId }: InstrumentModalProps) {
    const instrumentData = useInstrument({ instrumentId: editId });

    const handleInstrumentSubmit = async (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ): Promise<boolean> => {
        if (editId === undefined) {
            if (
                await addNewInstrument(
                    name,
                    serienr,
                    user,
                    toCalibrate,
                    calibrationInterval
                )
            ) {
                close();
                return true;
            }
        } else if (instrumentData.data !== undefined) {
            if (
                await updateInstruments({
                    ...instrumentData.data,
                    name,
                    serienr,
                    user,
                    toCalibrate,
                    calibrationInterval
                })
            ) {
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
