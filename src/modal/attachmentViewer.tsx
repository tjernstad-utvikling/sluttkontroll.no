import { useEffect, useState } from 'react';

import { Attachment } from '../contracts/attachmentApi';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { PdfViewer } from '../components/viewer';
import { getAttachmentFile } from '../api/attachmentApi';

interface AttachmentViewerModalProps {
    attachmentId: number | undefined;
    close: () => void;
    attachments: Attachment[];
}
export function AttachmentViewerModal({
    attachmentId,
    close,
    attachments
}: AttachmentViewerModalProps) {
    const [attachment, setAttachment] = useState<Attachment>();
    const [fileUrl, setFileUrl] = useState<string>();

    useEffect(() => {
        if (attachmentId) {
            setAttachment(attachments.find((a) => a.id === attachmentId));
        }
    }, [attachmentId, attachments]);

    useEffect(() => {
        let url = '';
        const load = async () => {
            if (attachment) {
                const res = await getAttachmentFile(attachment.file);
                url = URL.createObjectURL(res.data);
                setFileUrl(url);
            }
        };
        load();

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [attachment]);

    return (
        <Dialog
            open={!!attachmentId}
            onClose={close}
            fullWidth
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">Vedlegg</DialogTitle>
            <DialogContent>
                {fileUrl !== undefined && (
                    <PdfViewer
                        getFileName={() => {
                            if (attachment !== undefined) {
                                return `${attachment.id}-${attachment.name}.pdf`;
                            }
                            return 'vedlegg.pdf';
                        }}
                        fileUrl={fileUrl}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    lukk
                </Button>
            </DialogActions>
        </Dialog>
    );
}
