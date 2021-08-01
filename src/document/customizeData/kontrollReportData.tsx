import { SkjemaTable, columns, defaultColumns } from '../../tables/skjema';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Skjema } from '../../contracts/kontrollApi';
import { TableContainer } from '../../tables/tableContainer';
import TextField from '@material-ui/core/TextField';
import { useAvvik } from '../../data/avvik';
import { useEffect } from 'react';
import { useKontroll } from '../../data/kontroll';
import { useMeasurement } from '../../data/measurement';
import { useReport } from '../documentContainer';
import { useState } from 'react';

interface KontrollDocAdjustingProps {
    kontrollId: number;
}
export const KontrollDocAdjusting = ({
    kontrollId
}: KontrollDocAdjustingProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [_skjemaer, set_Skjemaer] = useState<Skjema[]>();
    const { setFilteredSkjemaer, skjemaer } = useReport();
    const { state } = useKontroll();
    const {
        state: { avvik }
    } = useAvvik();
    const {
        state: { measurements }
    } = useMeasurement();

    useEffect(() => {
        if (skjemaer !== undefined) {
            set_Skjemaer(
                skjemaer.filter((sk) => sk.kontroll.id === kontrollId)
            );
        }
    }, [kontrollId, skjemaer]);

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Tilpass
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Tilpass valgte kontrollskjemaer
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Velg kontrollskjemaer som skal med i rapporten. Dette
                        vil også gjelde for målinger
                    </DialogContentText>
                    {_skjemaer !== undefined ? (
                        <TableContainer
                            columns={columns(
                                state.kontroller ?? [],
                                avvik ?? [],
                                measurements ?? [],
                                '',
                                true
                            )}
                            defaultColumns={defaultColumns}
                            tableId="skjemaer">
                            <SkjemaTable
                                skjemaer={_skjemaer}
                                kontroller={state.kontroller ?? []}
                                avvik={avvik ?? []}
                                measurements={measurements ?? []}
                                onSelected={(skjemaer) =>
                                    setFilteredSkjemaer(skjemaer)
                                }
                            />
                        </TableContainer>
                    ) : (
                        <span>Laster skjemaer</span>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Lukk
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export const FrontPageAdjusting = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { frontPageData, setFrontPageData } = useReport();
    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Tilpass
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Tilpass fremside
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Framside er fylt ut med standard tittel, den kan endres
                        her
                    </DialogContentText>
                    {frontPageData !== undefined && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            value={frontPageData.title}
                            onChange={(e) =>
                                setFrontPageData({
                                    ...frontPageData,
                                    title: e.target.value
                                })
                            }
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Lukk
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
