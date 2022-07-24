import { useSkjemaById, useUpdateSkjema } from '../api/hooks/useSkjema';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { SkjemaSchema } from '../schema/skjema';

interface SkjemaEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const SkjemaEditModal = ({
    editId,
    close
}: SkjemaEditModalProps): JSX.Element => {
    const skjemaData = useSkjemaById(editId);

    const skjemaUpdateMutation = useUpdateSkjema();
    const handleUpdate = async (
        omrade: string,
        area: string
    ): Promise<boolean> => {
        if (skjemaData.data !== undefined) {
            try {
                await skjemaUpdateMutation.mutateAsync({
                    skjema: { ...skjemaData.data, area, omrade }
                });
            } catch (error) {
            } finally {
                close();
            }
        }
        return false;
    };

    return (
        <Dialog
            open={Boolean(editId)}
            onClose={close}
            aria-labelledby="add-Picture-Dialog"
            fullWidth>
            {skjemaData.isLoading && <LinearProgress />}
            <DialogTitle id="add-Picture-Dialog">Rediger skjema</DialogTitle>
            <DialogContent>
                {skjemaData.data && (
                    <SkjemaSchema
                        onSubmit={handleUpdate}
                        skjema={skjemaData.data}
                    />
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
