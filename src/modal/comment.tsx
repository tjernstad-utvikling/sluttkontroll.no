import { useKontrollById, useUpdateKontroll } from '../api/hooks/useKontroll';
import { useSkjemaById, useUpdateSkjema } from '../api/hooks/useSkjema';

import Button from '@mui/material/Button';
import { CommentSchema } from '../schema/comment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
    const kontrollData = useKontrollById(kontrollId);

    const skjemaData = useSkjemaById(skjemaId);

    const updateMutation = useUpdateKontroll();

    const updateSkjemaMutation = useUpdateSkjema();

    const kommentar = useMemo(() => {
        if (kontrollId) {
            return kontrollData.data ? kontrollData.data.kommentar : '';
        }
        if (skjemaId) {
            return skjemaData.data ? skjemaData.data.kommentar : '';
        }
        return '';
    }, [kontrollId, skjemaId, kontrollData.data, skjemaData.data]);

    async function handleCommentSave(kommentar: string) {
        if (kontrollId) {
            if (kontrollData.data) {
                try {
                    await updateMutation.mutateAsync({
                        ...kontrollData.data,
                        kommentar
                    });
                } catch (error) {
                } finally {
                    close();
                    return true;
                }
            }
        }
        if (skjemaId) {
            if (skjemaData.data) {
                try {
                    await updateSkjemaMutation.mutateAsync({
                        skjema: { ...skjemaData.data, kommentar }
                    });
                } catch (error) {
                } finally {
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
