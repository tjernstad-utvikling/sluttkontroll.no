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
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import nbLocale from 'date-fns/locale/nb';
import { useInstrument } from '../data/instrument';
import { useSnackbar } from 'notistack';

interface InstrumentCalibrationModalProps {
    regId: number | undefined;
    close: () => void;
}
export function InstrumentCalibrationModal({
    close,
    regId
}: InstrumentCalibrationModalProps) {
    const {
        state: { instruments },
        addCalibration
    } = useInstrument();

    const [instrument, setInstrument] = useState<Instrument>();
    const [newCalibrationDate, setNewCalibrationDate] =
        useState<MaterialUiPickersDate>(null);
    const [files, setFiles] = useState<File[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (regId !== undefined) {
            setInstrument(instruments?.find((i) => i.id === regId));
        }
    }, [regId, instruments]);

    const saveCalibration = async () => {
        if (
            instrument !== undefined &&
            newCalibrationDate !== null &&
            newCalibrationDate !== undefined
        ) {
            if (
                await addCalibration(
                    instrument.id,
                    format(newCalibrationDate, 'yyyy-MM-dd'),
                    files[0]
                )
            ) {
                close();
            }
        } else {
            enqueueSnackbar(
                'Kan ikke lagre kalibrering grunnet manglende data',
                {
                    variant: 'error'
                }
            );
        }
    };

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
                        clearable
                        fullWidth
                        label="Kalibreringsdato"
                        inputVariant="outlined"
                        value={newCalibrationDate}
                        onChange={(date) => setNewCalibrationDate(date)}
                        format="dd.MM.yyyy"
                    />
                </MuiPickersUtilsProvider>
                <div style={{ padding: 10 }} />
                <Typography>Kalibreringsbevis</Typography>
                <DropZone
                    accept="application/pdf"
                    setFiles={setFiles}
                    files={files}>
                    <ul>
                        {files.map((f) => (
                            <li key={f.name}>
                                <PictureAsPdfIcon /> {f.name}
                            </li>
                        ))}
                    </ul>
                </DropZone>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    Avbryt
                </Button>
                <Button onClick={saveCalibration} color="primary">
                    Lagre
                </Button>
            </DialogActions>
        </Dialog>
    );
}
