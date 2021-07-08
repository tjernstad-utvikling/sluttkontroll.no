import { Kontroll } from '../contracts/kontrollApi';
import { KontrollSchema } from '../schema/kontroll';
import Modal from '@material-ui/core/Modal';

interface KontrollEditModalProps {
    kontroll: Kontroll;
    editId: number | undefined;
    close: () => void;
}
export const KontrollEditModal = ({
    kontroll,
    editId,
    close
}: KontrollEditModalProps): JSX.Element => {
    return (
        <Modal
            open={Boolean(editId)}
            onClose={close}
            aria-labelledby="modal-title">
            <div>
                <h2 id="modal-title">Rediger kontroll</h2>
                <KontrollSchema />
            </div>
        </Modal>
    );
};
