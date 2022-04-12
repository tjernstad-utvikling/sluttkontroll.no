import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DropZone } from '../components/uploader';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import nbLocale from 'date-fns/locale/nb';
import { useInstrument } from '../api/hooks/useInstrument';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

interface InstrumentCalibrationModalProps {
    regId: number | undefined;
    close: () => void;
}
export function InstrumentCalibrationModal({
    close,
    regId
}: InstrumentCalibrationModalProps) {
    const [newCalibrationDate, setNewCalibrationDate] = useState<Date | null>(
        null
    );
    const [files, setFiles] = useState<File[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const instrumentData = useInstrument({ instrumentId: regId });

    const saveCalibration = async () => {
        if (instrumentData.data && newCalibrationDate && newCalibrationDate) {
            if (
                await addCalibration(
                    instrumentData.data.id,
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
                Registrer kalibrering for {instrumentData.data?.name}
            </DialogTitle>
            <DialogContent>
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={nbLocale}>
                    <DatePicker
                        clearable
                        label="Kalibreringsdato"
                        value={newCalibrationDate}
                        onChange={(date) => setNewCalibrationDate(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
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
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
                <Button onClick={saveCalibration} color="primary">
                    Lagre
                </Button>
            </DialogActions>
        </Dialog>
    );
}
