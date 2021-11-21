import Button from '@mui/material/Button';
import { CertificateSchema } from '../schema/certificate';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SertifikatType } from '../contracts/certificateApi';
import { useSnackbar } from 'notistack';

interface CertificateModalProps {
    regId: number | undefined;
    certificateTypes: SertifikatType[];
    close: () => void;
}
export function CertificateModal({
    close,
    regId,
    certificateTypes
}: CertificateModalProps) {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Dialog
            open={Boolean(regId)}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                Register nytt sertifikat
            </DialogTitle>
            <DialogContent>
                <CertificateSchema
                    onSubmit={async () => {
                        return false;
                    }}
                    certificateTypes={certificateTypes}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    Avbryt
                </Button>
                <Button onClick={() => console.log()} color="primary">
                    Lagre
                </Button>
            </DialogActions>
        </Dialog>
    );
}
