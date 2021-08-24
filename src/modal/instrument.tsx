import { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Instrument } from '../contracts/instrumentApi';
import { InstrumentSchema } from '../schema/instrument';
import { User } from '../contracts/userApi';
import { useInstrument } from '../data/instrument';

interface InstrumentModalProps {
    editId: number | undefined;
    open: boolean;
    close: () => void;
}
export function InstrumentModal({ open, close, editId }: InstrumentModalProps) {
    const {
        state: { instruments },
        addNewInstrument,
        updateInstruments
    } = useInstrument();

    const [editInstrument, setEditInstrument] = useState<Instrument>();

    useEffect(() => {
        if (editId !== undefined) {
            setEditInstrument(instruments?.find((i) => i.id === editId));
        }
    }, [editId, instruments]);

    const handleInstrumentSubmit = async (
        name: string,
        serienr: string,
        user: User | null,
        toCalibrate: boolean,
        calibrationInterval: number
    ): Promise<boolean> => {
        if (editId === undefined) {
            if (
                await addNewInstrument(
                    name,
                    serienr,
                    user,
                    toCalibrate,
                    calibrationInterval
                )
            ) {
                close();
                return true;
            }
        } else if (editInstrument !== undefined) {
            if (
                await updateInstruments({
                    ...editInstrument,
                    name,
                    serienr,
                    user,
                    toCalibrate,
                    calibrationInterval
                })
            ) {
                close();
                return true;
            }
        }
        return false;
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="add-Picture-Dialog">
            <DialogTitle id="add-Picture-Dialog">
                {editId === undefined ? 'Nytt' : 'Rediger'} instrument{' '}
            </DialogTitle>
            <DialogContent>
                <InstrumentSchema
                    onSubmit={handleInstrumentSubmit}
                    instrument={editInstrument}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    Avbryt
                </Button>
                <Button onClick={close} color="primary">
                    Lagre
                </Button>
            </DialogActions>
        </Dialog>
    );
}
