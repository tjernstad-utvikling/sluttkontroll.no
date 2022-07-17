import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { InstrumentSimpleTable } from '../tables/instrumentSimple';
import { useInstruments } from '../api/hooks/useInstrument';
import { useKontrollById } from '../api/hooks/useKontroll';

interface InstrumentSelectModalProps {
    kontrollId: number;
    open: boolean;
    close: () => void;
}
export function InstrumentSelectModal({
    open,
    kontrollId,
    close
}: InstrumentSelectModalProps) {
    const instrumentsData = useInstruments({});
    const kontrollData = useKontrollById(kontrollId);

    const [selected, setSelected] = useState<number[]>();

    useEffect(() => {
        if (kontrollData.data) {
            setSelected(kontrollData.data.instrumenter.map((i) => i.id));
        }
    }, [kontrollData.data]);

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="Select-instrument"
            fullWidth>
            <DialogTitle id="Select-instrument">
                Velg instrument(er)
            </DialogTitle>
            <DialogContent>
                <InstrumentSimpleTable
                    enableSelection
                    selectedIds={selected}
                    onSelected={setSelected}
                    instruments={instrumentsData.data ?? []}
                    isLoading={instrumentsData.isLoading}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} variant="contained">
                    Lagre ({selected?.length})
                </Button>
                <Button onClick={close} color="error">
                    Avbryt
                </Button>
            </DialogActions>
        </Dialog>
    );
}
