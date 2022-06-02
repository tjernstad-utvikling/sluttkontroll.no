import { useEffect, useState } from 'react';

import { AttachmentSchema } from '../schema/attachment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DropZone } from '../components/uploader';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useAddAttachment } from '../api/hooks/useAttachments';

interface AttachmentModalProps {
    kontrollId: number | undefined;
    close: () => void;
}
export function AttachmentModal({ kontrollId, close }: AttachmentModalProps) {
    const [files, setFiles] = useState<File[]>([]);

    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (files.length > 0) {
            setName(files[0].name);
        }
    }, [files]);
    const attachmentMutation = useAddAttachment();
    const saveAttachment = async (name: string, description: string) => {
        if (kontrollId) {
            try {
                attachmentMutation.mutateAsync({
                    attachment: files[0],
                    description,
                    kontrollId,
                    name
                });
            } catch (error) {
                console.log(error);
            } finally {
                setFiles([]);
                setName('');
                close();
                return true;
            }
        }
        return false;
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
                <AttachmentSchema
                    onSubmit={saveAttachment}
                    name={name}
                    description=""
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
}
