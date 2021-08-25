import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Instrument } from '../contracts/instrumentApi';
import { useInstrument } from '../data/instrument';

interface InstrumentCalibrationModalProps {
    regId: number | undefined;
    close: () => void;
}
export function InstrumentCalibrationModal({
    close,
    regId
}: InstrumentCalibrationModalProps) {
    const {
        state: { instruments }
    } = useInstrument();

    const [instrument, setInstrument] = useState<Instrument>();

    useEffect(() => {
        if (regId !== undefined) {
            setInstrument(instruments?.find((i) => i.id === regId));
        }
    }, [regId, instruments]);

    return (
        <Dialog
            open={Boolean(regId)}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                Registrer kalibrering for {instrument?.name}
            </DialogTitle>
            <DialogContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        value={undefined}
                        onChange={(e) => console.log(e)}
                    />
                </MuiPickersUtilsProvider>
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
