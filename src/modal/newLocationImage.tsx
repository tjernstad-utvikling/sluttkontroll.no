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
import { useAddLocationImage } from '../api/hooks/useKlient';
import { useState } from 'react';

interface NewImageModalProps {
    open: boolean;
    close: () => void;
    locationId: number;
    klientId: number;
}
export function NewImageModal({
    open,
    close,
    locationId,
    klientId
}: NewImageModalProps) {
    const classes = useStyles();
    const [images, setImages] = useState<File[]>([]);

    const addLocationImageMutation = useAddLocationImage();
    const saveNewImages = async () => {
        try {
            await addLocationImageMutation.mutateAsync({
                image: images[0],
                locationId
            });
        } catch (error) {
            console.log(error);
        } finally {
            setImages([]);
            close();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">Legg til bilde</DialogTitle>
            <DialogContent>
                <DropZone
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
