import { Card, CardContent } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SelectTemplate } from '../components/template';
import { SkjemaSchema } from '../schema/skjema';
import { SkjemaerViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useNewSkjema } from '../api/hooks/useSkjema';
import { usePageStyles } from '../styles/kontroll/page';
import { useSnackbar } from 'notistack';

const SkjemaNewView = () => {
    const { classes } = usePageStyles();

    const { kontrollId } = useParams<SkjemaerViewParams>();
    const history = useHistory();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selected, setSelected] = useState<Checkpoint[]>([]);
    const [template, setTemplate] = useState<Template>();

    const [selectFromTemplate, setSelectFromTemplate] =
        useState<boolean>(false);

    const newSkjemaMutation = useNewSkjema();

    const { enqueueSnackbar } = useSnackbar();

    const loadCheckpoints = async () => {
        try {
            const res = await getCheckpoints();
            if (res.status === 200) {
                setCheckpoints(
                    res.checkpoints.sort((a, b) =>
                        String(a.prosedyreNr).localeCompare(
                            String(b.prosedyreNr),
                            undefined,
                            { numeric: true, sensitivity: 'base' }
                        )
                    )
                );
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!selectFromTemplate && checkpoints === undefined) {
            loadCheckpoints();
        }
    }, [checkpoints, selectFromTemplate]);
    useEffectOnce(() => {
        loadCheckpoints();
    });

    const onSaveSkjema = async (
        omrade: string,
        area: string
    ): Promise<boolean> => {
        try {
            await newSkjemaMutation.mutateAsync({
                area,
                omrade,
                kontrollId: Number(kontrollId),
                checkpointIds: selected.map((c) => c.id)
            });
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av skjema', {
                variant: 'error'
            });
            return false;
        } finally {
            history.goBack();
            return true;
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Nytt skjema">
                            <CardContent>
                                <SkjemaSchema
                                    onSubmit={onSaveSkjema}
                                    checkpointCount={selected.length}
                                />

                                <SelectTemplate
                                    onSelect={(template) => {
                                        setSelectFromTemplate(false);
                                        setTemplate(template);
                                        setSelected(
                                            template.skjemaTemplateCheckpoints.map(
                                                (stc) => stc.checkpoint
                                            )
                                        );
                                    }}
                                    onOpen={() => {
                                        setSelectFromTemplate(
                                            !selectFromTemplate
                                        );
                                    }}
                                    isOpen={selectFromTemplate}
                                />

                                {!selectFromTemplate ? (
                                    checkpoints !== undefined ? (
                                        <TableContainer
                                            columns={columns({})}
                                            defaultColumns={defaultColumns}
                                            tableId="checkpoints">
                                            <CheckpointTable
                                                templateList={
                                                    template?.skjemaTemplateCheckpoints ||
                                                    []
                                                }
                                                checkpoints={checkpoints}
                                                onSelected={(ids) =>
                                                    setSelected(
                                                        checkpoints?.filter(
                                                            (c) =>
                                                                ids.indexOf(
                                                                    c.id
                                                                ) !== -1
                                                        )
                                                    )
                                                }
                                            />
                                        </TableContainer>
                                    ) : (
                                        <div>Laster sjekkpunkter</div>
                                    )
                                ) : (
                                    <div />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaNewView;
