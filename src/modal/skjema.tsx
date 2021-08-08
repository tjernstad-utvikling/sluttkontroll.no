import { useEffect, useState } from 'react';

import Modal from '@material-ui/core/Modal';
import { Skjema } from '../contracts/kontrollApi';
import { SkjemaSchema } from '../schema/skjema';
import { useKontroll } from '../data/kontroll';
import { useModalStyles } from '../styles/modal';

interface SkjemaEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const SkjemaEditModal = ({
    editId,
    close
}: SkjemaEditModalProps): JSX.Element => {
    const classes = useModalStyles();
    const [skjema, setSkjema] = useState<Skjema>();

    const {
        state: { skjemaer },
        updateSkjema
    } = useKontroll();

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjema(skjemaer.find((s) => s.id === editId));
        }
    }, [editId, skjemaer]);

    const handleUpdate = async (
        omrade: string,
        area: string
    ): Promise<boolean> => {
        if (skjema !== undefined) {
            if (await updateSkjema({ ...skjema, area, omrade })) {
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
                <h2 id="modal-title">Rediger skjema</h2>
                {skjema && (
                    <SkjemaSchema onSubmit={handleUpdate} skjema={skjema} />
                )}
            </div>
        </Modal>
    );
};
