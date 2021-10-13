import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Card } from '../components/card';
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
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const SkjemaNewView = () => {
    const { classes } = usePageStyles();
    const { saveNewSkjema } = useKontroll();
    const { kontrollId } = useParams<SkjemaerViewParams>();
    const history = useHistory();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selected, setSelected] = useState<Checkpoint[]>([]);
    const [template, setTemplate] = useState<Template>();

    const [selectFromTemplate, setSelectFromTemplate] =
        useState<boolean>(false);

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
        if (await saveNewSkjema(area, omrade, selected, Number(kontrollId))) {
            history.goBack();
            return true;
        }
        return false;
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Nytt skjema">
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
                                    setSelectFromTemplate(!selectFromTemplate);
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
                                            onSelected={(checkpoints) =>
                                                setSelected(checkpoints)
                                            }
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster sjekkpunkter</div>
                                )
                            ) : (
                                <div />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaNewView;
