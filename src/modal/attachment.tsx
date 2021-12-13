import { useEffect, useState } from 'react';

import { Attachment } from '../contracts/attachmentApi';
import { AttachmentSchema } from '../schema/attachment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DropZone } from '../components/uploader';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { uploadAttachment } from '../api/attachmentApi';
import { useSnackbar } from 'notistack';

interface AttachmentModalProps {
    kontrollId: number | undefined;
    close: () => void;
    updateAttachmentList?: (attachment: Attachment) => void;
}
export function AttachmentModal({
    kontrollId,
    close,
    updateAttachmentList
}: AttachmentModalProps) {
    const [files, setFiles] = useState<File[]>([]);

    const [name, setName] = useState<string>('');

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (files.length > 0) {
            setName(files[0].name);
        }
    }, [files]);

    const saveAttachment = async (name: string, description: string) => {
        if (kontrollId) {
            const res = await uploadAttachment(
                kontrollId,
                files[0],
                name,
                description
            );
            if (res.status === 200) {
                if (updateAttachmentList) {
                    if (res.attachment) updateAttachmentList(res.attachment);
                }
                setFiles([]);
                setName('');
                close();
                enqueueSnackbar('Fil er lastet opp.', {
                    variant: 'success'
                });
                return true;
            }
            if (res.status === 400) {
                enqueueSnackbar('Navn eller fil mangler', {
                    variant: 'warning'
                });
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
