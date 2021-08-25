import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DropZone } from '../components/uploader';
import { Instrument } from '../contracts/instrumentApi';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import nbLocale from 'date-fns/locale/nb';
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
    const [newCalibrationDate, setNewCalibrationDate] =
        useState<MaterialUiPickersDate>(new Date());
    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        if (regId !== undefined) {
            const _instrument = instruments?.find((i) => i.id === regId);
            if (_instrument !== undefined) {
                setInstrument(_instrument);
                if (_instrument.sisteKalibrert !== null) {
                    setNewCalibrationDate(
                        new Date(_instrument.sisteKalibrert.date)
                    );
                }
            }
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
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={nbLocale}>
                    <KeyboardDatePicker
                        label="Kalibreringsdato"
                        inputVariant="outlined"
                        value={newCalibrationDate}
                        onChange={(date) => setNewCalibrationDate(date)}
                        format="dd.MM.yyyy"
                    />
                </MuiPickersUtilsProvider>
                <DropZone
                    accept="image/png, image/jpeg"
                    setFiles={setImages}
                    files={images}>
                    <div></div>
                </DropZone>
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
