import { useEffect, useState } from 'react';

import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointSchema } from '../schema/checkpoint';
import Modal from '@material-ui/core/Modal';
import { useModalStyles } from '../styles/modal';

interface CheckpointModalProps {
    editId?: number;
    isOpen: boolean;
    checkpoints?: Checkpoint[];
    close: () => void;
    onSubmit: (
        prosedyre: string,
        prosedyreNr: string,
        tekst: string,
        gruppe: string
    ) => Promise<boolean>;
}

export const CheckpointModal = ({
    editId,
    isOpen,
    checkpoints,
    close,
    onSubmit
}: CheckpointModalProps): JSX.Element => {
    const classes = useModalStyles();
    const [checkpoint, setCheckpoint] = useState<Checkpoint>();

    useEffect(() => {
        if (checkpoints !== undefined) {
            setCheckpoint(checkpoints.find((c) => c.id === editId));
        }
    }, [editId, checkpoints]);

    return (
        <Modal
            open={Boolean(editId) || isOpen}
            onClose={close}
            aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">
                    {editId ? 'Rediger' : 'Nytt'} sjekkpunkt
                </h2>
                {checkpoint !== undefined ? (
                    <CheckpointSchema
                        onSubmit={onSubmit}
                        checkpoint={checkpoint}
                    />
                ) : (
                    <CheckpointSchema onSubmit={onSubmit} />
                )}
            </div>
        </Modal>
    );
};
