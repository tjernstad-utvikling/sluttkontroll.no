import { useEffect, useState } from 'react';

import { Avvik } from '../contracts/avvikApi';
import { AvvikSchema } from '../schema/avvik';
import Modal from '@material-ui/core/Modal';
import { User } from '../contracts/userApi';
import { useAvvik } from '../data/avvik';
import { useModalStyles } from '../styles/modal';

interface AvvikEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const AvvikEditModal = ({
    editId,
    close
}: AvvikEditModalProps): JSX.Element => {
    const classes = useModalStyles();
    const [editAvvik, setEditAvvik] = useState<Avvik>();

    const {
        state: { avvik },
        updateAvvik
    } = useAvvik();

    useEffect(() => {
        if (avvik !== undefined) {
            setEditAvvik(avvik.find((a) => a.id === editId));
        }
    }, [editId, avvik]);

    const handleUpdate = async (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null
    ): Promise<boolean> => {
        if (editAvvik !== undefined) {
            if (
                await updateAvvik({
                    ...editAvvik,
                    beskrivelse,
                    kommentar,
                    utbedrer: utbedrer !== null ? utbedrer : []
                })
            ) {
                close();
            }
        }
        return false;
    };

    return (
        <Modal
            open={Boolean(editId)}
            onClose={close}
            aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">Rediger Avvik</h2>
                {editAvvik && (
                    <AvvikSchema onSubmit={handleUpdate} avvik={editAvvik} />
                )}
            </div>
        </Modal>
    );
};
