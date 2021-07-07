import { KontrollSchema } from '../schema/kontroll';
import Modal from '@material-ui/core/Modal';
import { useState } from 'react';

export const KontrollEditModal = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Modal
            open={open}
            onClose={() => setOpen(!open)}
            aria-labelledby="modal-title">
            <div>
                <h2 id="modal-title">Rediger kontroll</h2>
                <KontrollSchema />
            </div>
        </Modal>
    );
};
