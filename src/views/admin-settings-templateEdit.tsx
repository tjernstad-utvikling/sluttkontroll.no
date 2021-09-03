import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AdminTemplateEditViewParams } from '../contracts/navigation';
import { Card } from '../components/card';
import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { SkjemaTemplateSchema } from '../schema/skjemaTemplate';
import { TableContainer } from '../tables/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useTemplate } from '../data/skjemaTemplate';

const SkjemaTemplateNewView = () => {
    const classes = usePageStyles();

    const { templateId } = useParams<AdminTemplateEditViewParams>();
    const history = useHistory();
    const [template, setTemplate] = useState<Template>();

    const {
        state: { templates },
        updateTemplate
    } = useTemplate();

    useEffect(() => {
        const _template = templates?.find((t) => t.id === Number(templateId));

        if (_template !== undefined) {
            setTemplate(_template);
            setSelected(
                _template.skjemaTemplateCheckpoints.map((stc) => stc.checkpoint)
            );
        }
    }, [templateId, templates]);

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selected, setSelected] = useState<Checkpoint[]>([]);

    useEffectOnce(async () => {
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
    });

    const onSaveTemplate = async (name: string): Promise<boolean> => {
        if (template !== undefined) {
            if (await updateTemplate({ ...template, name }, selected)) {
                history.goBack();
                return true;
            }
        }
        return false;
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Rediger sjekklistemal">
                            {template !== undefined && (
                                <>
                                    <SkjemaTemplateSchema
                                        onSubmit={onSaveTemplate}
                                        checkpointCount={selected.length}
                                        template={template}
                                    />

                                    {checkpoints !== undefined ? (
                                        <TableContainer
                                            columns={columns('')}
                                            defaultColumns={defaultColumns}
                                            tableId="checkpoints">
                                            <CheckpointTable
                                                templateList={
                                                    template.skjemaTemplateCheckpoints
                                                }
                                                checkpoints={checkpoints}
                                                onSelected={(checkpoints) =>
                                                    setSelected(checkpoints)
                                                }
                                            />
                                        </TableContainer>
                                    ) : (
                                        <div>Laster sjekkpunkter</div>
                                    )}
                                </>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaTemplateNewView;
