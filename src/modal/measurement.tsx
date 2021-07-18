import { useEffect, useState } from 'react';

import { Kontroll } from '../contracts/kontrollApi';
import { KontrollSchema } from '../schema/kontroll';
import Modal from '@material-ui/core/Modal';
import { User } from '../contracts/userApi';
import { useKontroll } from '../data/kontroll';
import { useModalStyles } from '../styles/modal';

interface MeasurementModalProps {
    close: () => void;
}

export const MeasurementModal = ({
    close
}: MeasurementModalProps): JSX.Element => {
    const classes = useModalStyles();

    const handleSave = async (
        name: string,
        user: User,
        avvikUtbedrere: User[] | null
    ): Promise<boolean> => {
        if (kontroll !== undefined) {
            if (
                await updateKontroll({
                    ...kontroll,
                    name,
                    user,
                    avvikUtbedrere:
                        avvikUtbedrere !== null ? avvikUtbedrere : []
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
                <h2 id="modal-title">Ny måling</h2>
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
