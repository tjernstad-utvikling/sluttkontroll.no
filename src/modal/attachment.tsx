import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DropZone } from '../components/uploader';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useState } from 'react';

interface AttachmentModalProps {
    kontrollId: number | undefined;
    close: () => void;
}
export function AttachmentModal({ kontrollId, close }: AttachmentModalProps) {
    const [files, setFiles] = useState<File[]>([]);

    const saveNewImages = async () => {
        // if (await addAvvikImages(avvik, images)) {
        //     setImages([]);
        //     close();
        // }
    };

    return (
        <Dialog
            open={!!kontrollId}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                Last opp rapport vedlegg
            </DialogTitle>
            <DialogContent>
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
                <Button onClick={saveNewImages} color="primary">
                    Lagre
                </Button>
            </DialogActions>
        </Dialog>
    );
}
