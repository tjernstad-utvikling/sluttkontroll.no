import { useEffect, useState } from 'react';

import { Kontroll } from '../contracts/kontrollApi';
import { KontrollSchema } from '../schema/kontroll';
import Modal from '@material-ui/core/Modal';
import { User } from '../contracts/userApi';
import { updateKontroll } from '../api/kontrollApi';
import { useKontroll } from '../data/kontroll';
import { useModalStyles } from '../styles/modal';

interface KontrollEditModalProps {
    editId: number | undefined;
    close: () => void;
}
export const KontrollEditModal = ({
    editId,
    close
}: KontrollEditModalProps): JSX.Element => {
    const classes = useModalStyles();
    const [kontroll, setKontroll] = useState<Kontroll>();

    const {
        state: { kontroller }
    } = useKontroll();

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroll(kontroller.find((k) => k.id === editId));
        }
    }, [editId, kontroller]);

    const handleUpdate = async (
        name: string,
        user: User,
        avvikUtbedrere: User[]
    ): Promise<boolean> => {
        if (kontroll !== undefined) {
            await updateKontroll({ ...kontroll, name, user, avvikUtbedrere });
            return true;
        }
        return false;
    };

    return (
        <Modal
            open={Boolean(editId)}
            onClose={close}
            aria-labelledby="modal-title">
            <div className={classes.root}>
                <h2 id="modal-title">Rediger kontroll</h2>
                {kontroll && (
                    <KontrollSchema
                        onSubmit={handleUpdate}
                        kontroll={kontroll}
                    />
                )}
            </div>
        </Modal>
    );
};
