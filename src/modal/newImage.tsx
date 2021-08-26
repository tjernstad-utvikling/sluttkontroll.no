import { Theme, createStyles, makeStyles } from '@material-ui/core';

import { Avvik } from '../contracts/avvikApi';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DropZone } from '../components/uploader';
import { NewImageCard } from '../components/avvik';
import { useAvvik } from '../data/avvik';
import { useState } from 'react';

interface NewImageModalProps {
    open: boolean;
    close: () => void;
    avvik: Avvik;
}
export function NewImageModal({ open, close, avvik }: NewImageModalProps) {
    const classes = useStyles();
    const [images, setImages] = useState<File[]>([]);

    const { addAvvikImages } = useAvvik();

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
                <Button onClick={close} color="primary">
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
