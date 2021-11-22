import Button from '@mui/material/Button';
import { CertificateSchema } from '../schema/certificate';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SertifikatType } from '../contracts/certificateApi';

interface CertificateModalProps {
    isOpen: boolean;
    certificateTypes: SertifikatType[] | undefined;
    close: () => void;
    handleSubmit: (
        number: string,
        type: SertifikatType,
        validTo: string
    ) => Promise<boolean>;
}
export function CertificateModal({
    close,
    isOpen,
    certificateTypes,
    handleSubmit
}: CertificateModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                Register nytt sertifikat
            </DialogTitle>
            <DialogContent>
                {certificateTypes !== undefined ? (
                    <CertificateSchema
                        onSubmit={handleSubmit}
                        certificateTypes={certificateTypes}
                    />
                ) : (
                    <div>Laster sertifikattyper</div>
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
