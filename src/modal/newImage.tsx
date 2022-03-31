import { Avvik } from '../contracts/avvikApi';
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
import { useState } from 'react';

interface NewImageModalProps {
    open: boolean;
    close: () => void;
    avvik: Avvik;
    addAvvikImages: (avvik: Avvik, images: File[]) => Promise<boolean>;
}
export function NewImageModal({
    open,
    close,
    avvik,
    addAvvikImages
}: NewImageModalProps) {
    const classes = useStyles();
    const [images, setImages] = useState<File[]>([]);

    const saveNewImages = async () => {
        if (await addAvvikImages(avvik, images)) {
            setImages([]);
            close();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">Legg til bilder</DialogTitle>
            <DialogContent>
                <DropZone
                    multiple
                    accept="image/png, image/jpeg"
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
                <Button onClick={saveNewImages} color="primary">
                    Lagre
                </Button>
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
