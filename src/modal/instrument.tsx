import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { InstrumentSchema } from '../schema/instrument';
import { User } from '../contracts/userApi';
import { useInstrument } from '../data/instrument';

interface InstrumentModalProps {
    open: boolean;
    close: () => void;
}
export function InstrumentModal({ open, close }: InstrumentModalProps) {
    // const {} = useInstrument();

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">Nytt instrument </DialogTitle>
            <DialogContent>
                <InstrumentSchema
                    onSubmit={async (
                        name: string,
                        serienr: string,
                        user: User | null,
                        toCalibrate: boolean,
                        calibrationInterval: number
                    ) => {
                        console.log();
                        return true;
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    Avbryt
                </Button>
                <Button onClick={close} color="primary">
                    Lagre
                </Button>
            </DialogActions>
        </Dialog>
    );
}
