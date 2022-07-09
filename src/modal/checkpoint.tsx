import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointSchema } from '../schema/checkpoint';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface CheckpointModalProps {
    editId?: number;
    isOpen: boolean;
    checkpoints?: Checkpoint[];
    close: () => void;
    onSubmit: (saveValues: {
        prosedyre: string;
        prosedyreNr: string;
        tekst: string;
        mainCategory: string;
        groupCategory: number;
        checkpointNumber: number;
    }) => Promise<boolean>;
}

export const CheckpointModal = ({
    editId,
    isOpen,
    checkpoints,
    close,
    onSubmit
}: CheckpointModalProps): JSX.Element => {
    const [checkpoint, setCheckpoint] = useState<Checkpoint>();

    useEffect(() => {
        if (checkpoints !== undefined) {
            setCheckpoint(checkpoints.find((c) => c.id === editId));
        }
    }, [editId, checkpoints]);

    return (
        <Dialog
            open={isOpen}
            onClose={close}
            aria-labelledby="add-Picture-Dialog"
            fullScreen>
            <DialogTitle id="add-Picture-Dialog">
                {editId ? 'Rediger' : 'Nytt'} sjekkpunkt
            </DialogTitle>
            <DialogContent>
                {checkpoint !== undefined ? (
                    <CheckpointSchema
                        onSubmit={onSubmit}
                        checkpoint={checkpoint}
                    />
                ) : (
                    <CheckpointSchema onSubmit={onSubmit} />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
};
