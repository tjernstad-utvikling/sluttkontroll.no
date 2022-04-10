import {
    AttachmentTable,
    columns as attachmentColumns,
    defaultColumns as attachmentDefaultColumns
} from '../../tables/attachment';
import { SkjemaTable, columns, defaultColumns } from '../../tables/skjema';
import { getImageFile, uploadImageFile } from '../../api/imageApi';
import { useEffect, useState } from 'react';

import { AttachmentModal } from '../../modal/attachment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Editor } from '../../tools/editor';
import Grid from '@mui/material/Grid';
import { OutputData } from '@editorjs/editorjs';
import { RapportEgenskaper } from '../../contracts/reportApi';
import { ReportModules } from '../../contracts/reportApi';
import { ReportPropertiesSchema } from '../../schema/reportProperties';
import { ReportSettingsSchema } from '../../schema/reportSettings';
import { Skjema } from '../../contracts/kontrollApi';
import Switch from '@mui/material/Switch';
import { TableContainer } from '../../tables/tableContainer';
import { Theme } from '@mui/material';
import { makeStyles } from '../../theme/makeStyles';
import { saveKontrollReportData } from '../../api/kontrollApi';
import { updateReportStatement } from '../../api/reportApi';
import { useAvvik } from '../../api/hooks/useAvvik';
import { useClient } from '../../data/klient';
import { useDebounce } from '../../hooks/useDebounce';
import { useKontrollById } from '../../api/hooks/useKontroll';
import { useMeasurements } from '../../api/hooks/useMeasurement';
import { useReport } from '../documentContainer';
import { useSnackbar } from 'notistack';

export const FrontPageAdjusting = () => {
    const { classes } = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const { reportSetting, updateSetting } = useReport();
    return (
        <>
            <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Rapportinnstillinger
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Rapportinnstillinger
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Framside er fylt ut med standard tittel, den kan endres
                        her
                    </DialogContentText>
                    {reportSetting && (
                        <ReportSettingsSchema
                            onSubmit={(r) => {
                                updateSetting(r);
                                setOpen(false);
                            }}
                            reportSetting={reportSetting}
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
    const { classes } = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [_skjemaer, set_Skjemaer] = useState<Skjema[]>();
    const { updateFilteredSkjemaer, skjemaer, filteredSkjemaer } = useReport();
    const kontrollData = useKontrollById(kontrollId);

    const avvikData = useAvvik({
        includeClosed: true,
        kontrollId: kontrollId
    });

    const measurementData = useMeasurements({ kontrollId });

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
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Velg kontrollskjemaer til rapporten (
                {filteredSkjemaer && filteredSkjemaer.length})
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Utvalgte kontrollskjemaer
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Velg kontrollskjemaer som skal med i rapporten. Dette
                        vil også gjelde for målinger
                    </DialogContentText>
                    {_skjemaer !== undefined ? (
                        <TableContainer
                            columns={columns(
                                kontrollData.data,
                                avvikData.data ?? [],
                                measurementData.data ?? [],
                                '',
                                (a) => console.log(a),
                                (a) => console.log(a),
                                false,
                                [],
                                (a) => console.log(a),
                                true,
                                true
                            )}
                            defaultColumns={defaultColumns}
                            tableId="skjemaer">
                            <SkjemaTable
                                isLoading={false}
                                skjemaer={_skjemaer}
                                selectedSkjemaer={filteredSkjemaer}
                                onSelected={(ids) => {
                                    updateFilteredSkjemaer(
                                        skjemaer?.filter(
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
    const { classes } = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const { isModuleActive, toggleModuleVisibilityState } = useReport();
    return (
        <>
            <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Måleprotokoll
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Måleprotokoll</DialogTitle>
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
                                checked={isModuleActive(
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
    const { classes } = useStyles();
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
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Rapportegenskaper
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Rapportegenskaper
                </DialogTitle>
                <DialogContent>
                    {kontroll !== undefined && klienter !== undefined && (
                        <div className={classes.propertiesBox}>
                            <ReportPropertiesSchema
                                onSubmit={saveReportProperties}
                                kontroll={kontroll}
                                klienter={klienter}
                            />
                        </div>
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
interface ReportStatementProps {
    kontrollId: number;
}
export const ReportStatement = ({ kontrollId }: ReportStatementProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { classes } = useStyles();

    const { statementText, updateStatement } = useReport();
    const { enqueueSnackbar } = useSnackbar();
    const [statement, setStatement] = useState<OutputData>();

    useEffect(() => {
        if (statementText) {
            setStatement(statementText);
        }
    }, [statementText]);

    const debouncedStatement = useDebounce<OutputData | undefined>(
        statement,
        3000
    );
    // Effect for API call
    useEffect(
        () => {
            const save = async () => {
                if (debouncedStatement) {
                    updateReportStatement(
                        {
                            ...debouncedStatement,
                            blocks: debouncedStatement.blocks.map((b) => {
                                const _block = b;
                                if (b.type === 'image') {
                                    _block.data.file.localUrl = undefined;
                                }
                                return _block;
                            })
                        },
                        kontrollId
                    ).then((results) => {
                        updateStatement(debouncedStatement);
                    });
                }
            };
            save();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [debouncedStatement, kontrollId] // Only call effect if debounced search term changes
    );

    async function handleSaveImage(file: File): Promise<{
        success: boolean;
        file: { url: string; id: number };
    }> {
        try {
            const { status, image } = await uploadImageFile(
                Number(kontrollId),
                file
            );
            if (status === 200 && image) {
                enqueueSnackbar('Bilde er lastet opp', {
                    variant: 'success'
                });
                return {
                    success: true,
                    file: image
                };
            }
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av bildet', {
                variant: 'error'
            });
        }
        return { success: false, file: { url: '', id: 0 } };
    }
    async function handleGetImage(name: string): Promise<{
        data: Blob;
    }> {
        try {
            const res = await getImageFile(name);
            if (res.status === 200) {
                return res;
            }
        } catch (error: any) {
            enqueueSnackbar('Problemer med lasting av bildet', {
                variant: 'error'
            });
            throw new Error(error);
        }
        throw new Error('');
    }

    return (
        <>
            <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Generell vurdering
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Generell vurdering
                </DialogTitle>
                <DialogContent>
                    <div className={classes.propertiesBox}>
                        <Editor
                            setContent={setStatement}
                            text={statement}
                            uploadImage={handleSaveImage}
                            loadImage={handleGetImage}
                        />
                    </div>
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

interface SelectAttachmentsProps {
    kontrollId: number;
}
export const SelectAttachments = ({ kontrollId }: SelectAttachmentsProps) => {
    const { classes } = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [openAddAttachment, setOpenAddAttachment] = useState<
        number | undefined
    >(undefined);
    const { attachments, updateSelectedAttachments, selectedAttachments } =
        useReport();

    return (
        <>
            <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Velg vedlegg ({selectedAttachments.length})
            </Button>
            <Dialog
                open={open}
                fullWidth
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Vedlegg</DialogTitle>
                <DialogContent>
                    {attachments !== undefined ? (
                        <TableContainer
                            columns={attachmentColumns({ skipActions: true })}
                            defaultColumns={attachmentDefaultColumns}
                            tableId="attachment">
                            <AttachmentTable
                                attachments={attachments}
                                selectedAttachments={selectedAttachments}
                                onSelected={(ids) =>
                                    updateSelectedAttachments(
                                        attachments?.filter(
                                            (a) => ids.indexOf(a.id) !== -1
                                        )
                                    )
                                }
                                leftAction={
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                            setOpenAddAttachment(kontrollId)
                                        }>
                                        Last opp flere vedlegg
                                    </Button>
                                }
                            />
                        </TableContainer>
                    ) : (
                        <div>Laster vedlegg</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Lukk
                    </Button>
                </DialogActions>
            </Dialog>
            <AttachmentModal
                kontrollId={openAddAttachment}
                close={() => setOpenAddAttachment(undefined)}
            />
        </>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    propertiesBox: {
        padding: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1)
    }
}));
