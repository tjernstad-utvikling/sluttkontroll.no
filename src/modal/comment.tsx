import { useKontrollById, useUpdateKontroll } from '../api/hooks/useKontroll';

import Button from '@mui/material/Button';
import { CommentSchema } from '../schema/comment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useKontroll } from '../data/kontroll';
import { useMemo } from 'react';

interface CommentModalProps {
    kontrollId?: number;
    skjemaId?: number;
    open: boolean;
    close: () => void;
}

export const CommentModal = ({
    kontrollId,
    skjemaId,
    open,
    close
}: CommentModalProps): JSX.Element => {
    const {
        state: { skjemaer },

        updateSkjema
    } = useKontroll();

    const kontrollData = useKontrollById(kontrollId);

    const updateMutation = useUpdateKontroll();

    const kommentar = useMemo(() => {
        if (kontrollId) {
            return kontrollData.data ? kontrollData.data.kommentar : '';
        }
        if (skjemaId) {
            const skjema = skjemaer?.find((s) => s.id === skjemaId);
            return skjema ? skjema.kommentar : '';
        }
        return '';
    }, [kontrollId, kontrollData.data, skjemaId, skjemaer]);

    async function handleCommentSave(kommentar: string) {
        if (kontrollId) {
            if (kontrollData.data) {
                if (
                    await updateMutation.mutateAsync({
                        ...kontrollData.data,
                        kommentar
                    })
                ) {
                    close();
                    return true;
                }
            }
        }
        if (skjemaId) {
            const skjema = skjemaer?.find((s) => s.id === skjemaId);
            if (skjema) {
                if (await updateSkjema({ ...skjema, kommentar })) {
                    close();
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog"
            fullWidth>
            <DialogTitle id="add-Picture-Dialog">
                Kommentar til avvikene
            </DialogTitle>
            <DialogContent>
                <CommentSchema
                    kommentar={kommentar}
                    onSubmit={handleCommentSave}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
};
