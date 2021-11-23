import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Skjema } from '../contracts/kontrollApi';
import { SkjemaSchema } from '../schema/skjema';
import { useKontroll } from '../data/kontroll';

interface SkjemaEditModalProps {
    editId: number | undefined;
    close: () => void;
}

export const SkjemaEditModal = ({
    editId,
    close
}: SkjemaEditModalProps): JSX.Element => {
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
        <Dialog
            open={Boolean(editId)}
            onClose={close}
            aria-labelledby="add-Picture-Dialog"
            fullWidth>
            <DialogTitle id="add-Picture-Dialog">Rediger skjema</DialogTitle>
            <DialogContent>
                {skjema && (
                    <SkjemaSchema onSubmit={handleUpdate} skjema={skjema} />
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
