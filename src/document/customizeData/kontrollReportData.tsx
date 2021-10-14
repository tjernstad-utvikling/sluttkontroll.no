import { RapportEgenskaper, Skjema } from '../../contracts/kontrollApi';
import { ReportModules, useReport } from '../documentContainer';
import { SkjemaTable, columns, defaultColumns } from '../../tables/skjema';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { ReportPropertiesSchema } from '../../schema/reportProperties';
import Switch from '@mui/material/Switch';
import { TableContainer } from '../../tables/tableContainer';
import TextField from '@mui/material/TextField';
import { saveKontrollReportData } from '../../api/kontrollApi';
import { useAvvik } from '../../data/avvik';
import { useClient } from '../../data/klient';
import { useEffect } from 'react';
import { useKontroll } from '../../data/kontroll';
import { useMeasurement } from '../../data/measurement';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

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
                                (a) => console.log(a),
                                (a) => console.log(a),
                                true
                            )}
                            defaultColumns={defaultColumns}
                            tableId="skjemaer">
                            <SkjemaTable
                                skjemaer={_skjemaer}
                                kontroller={state.kontroller ?? []}
                                avvik={avvik ?? []}
                                measurements={measurements ?? []}
                                onSelected={(ids) => {
                                    setFilteredSkjemaer(
                                        state?.skjemaer?.filter(
                                            (s) => ids.indexOf(s.id) !== -1
                                        )
                                    );
                                }}
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

export const MeasurementAdjusting = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { visibleReportModules, toggleModuleVisibilityState } = useReport();
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
                    Tilpass måleprotokoll
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Velg plassering av måleprotokoll
                    </DialogContentText>
                    <Grid
                        component="label"
                        container
                        alignItems="center"
                        spacing={1}>
                        <Grid item>Separat måleprotokoll</Grid>
                        <Grid item>
                            <Switch
                                checked={visibleReportModules.includes(
                                    ReportModules.inlineMeasurementModule
                                )}
                                onChange={() =>
                                    toggleModuleVisibilityState(
                                        ReportModules.inlineMeasurementModule
                                    )
                                }
                                name={ReportModules.inlineMeasurementModule}
                                color="primary"
                            />
                        </Grid>
                        <Grid item>
                            Måleprotokoll ved tilhørende kontrollskjema
                        </Grid>
                    </Grid>
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
export const ReportProperties = () => {
    const [open, setOpen] = useState<boolean>(false);

    const { kontroll, updateKontroll } = useReport();
    const { enqueueSnackbar } = useSnackbar();
    const {
        state: { klienter }
    } = useClient();

    const saveReportProperties = async (
        reportProperties: RapportEgenskaper
    ) => {
        try {
            if (kontroll !== undefined) {
                const response = await saveKontrollReportData(
                    kontroll.id,
                    reportProperties
                );
                if (response.status === 400) {
                    enqueueSnackbar('Et eller flere felter mangler data', {
                        variant: 'warning'
                    });
                }
                if (
                    response.status === 200 &&
                    response.kontroll !== undefined
                ) {
                    updateKontroll(response.kontroll);
                    setOpen(false);
                    enqueueSnackbar('Rapportegenskaper er lagret', {
                        variant: 'success'
                    });
                    return true;
                }
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av kontrollegenskaper', {
                variant: 'error'
            });
            return false;
        }
    };
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
                    Tilpass rapportegenskaper
                </DialogTitle>
                <DialogContent>
                    {kontroll !== undefined && klienter !== undefined && (
                        <ReportPropertiesSchema
                            onSubmit={saveReportProperties}
                            kontroll={kontroll}
                            klienter={klienter}
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
