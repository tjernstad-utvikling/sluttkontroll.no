import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DropZone } from '../components/uploader';
import { NewImageCard } from '../components/avvik';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import sluttkontrollApi from '../api/sluttkontroll';
import { useState } from 'react';

interface AttachmentModalProps {
    kontrollId: number | undefined;
    close: () => void;
}
export function UploadModal({ kontrollId, close }: AttachmentModalProps) {
    const classes = useStyles();
    const [images, setImages] = useState<File[]>([]);

    const saveAttachment = async () => {
        if (kontrollId) {
            const imgs = () =>
                Array.from({ length: Math.ceil(images.length / 12) }, (v, i) =>
                    images.slice(i * 12, i * 12 + 12)
                );

            for (const imgGroup of imgs()) {
                try {
                    const formData = new FormData();

                    imgGroup.forEach((file) => {
                        formData.append('images', file);
                    });

                    await sluttkontrollApi.post<unknown>(`/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    setImages([]);

                    close();
                    return true;
                }
            }
        }
        return false;
    };

    return (
        <Dialog
            open={!!kontrollId}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">Last opp filer</DialogTitle>
            <DialogContent>
                <DropZone
                    multiple
                    accept="*"
                    setFiles={setImages}
                    files={images}>
                    <div className={classes.imageContainer}>
                        {images.map((img) => (
                            <NewImageCard
                                key={img.name}
                                file={img}
                                setFiles={setImages}
                            />
                        ))}
                    </div>
                </DropZone>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
                <Button onClick={() => saveAttachment()}>Lagre</Button>
            </DialogActions>
        </Dialog>
    );
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
        }
    })
);
