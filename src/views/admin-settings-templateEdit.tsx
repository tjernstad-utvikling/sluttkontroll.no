import { Card, CardContent } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AdminTemplateEditViewParams } from '../contracts/navigation';
import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SkjemaTemplateSchema } from '../schema/skjemaTemplate';
import { TableContainer } from '../tables/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { usePageStyles } from '../styles/kontroll/page';
import { useTemplate } from '../data/skjemaTemplate';

const SkjemaTemplateNewView = () => {
    const { classes } = usePageStyles();

    const { templateId } = useParams<AdminTemplateEditViewParams>();
    const history = useHistory();
    const [template, setTemplate] = useState<Template>();

    const checkpointData = useCheckpoints();

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

    const [selected, setSelected] = useState<Checkpoint[]>([]);

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
                            <CardContent>
                                {template !== undefined && (
                                    <>
                                        <SkjemaTemplateSchema
                                            onSubmit={onSaveTemplate}
                                            checkpointCount={selected.length}
                                            template={template}
                                        />

                                        <TableContainer
                                            columns={columns({})}
                                            defaultColumns={defaultColumns}
                                            tableId="checkpoints">
                                            <CheckpointTable
                                                isLoading={
                                                    checkpointData.isLoading
                                                }
                                                templateList={
                                                    template.skjemaTemplateCheckpoints
                                                }
                                                checkpoints={
                                                    checkpointData.data ?? []
                                                }
                                                onSelected={(ids) =>
                                                    setSelected(
                                                        checkpointData.data
                                                            ? checkpointData.data?.filter(
                                                                  (c) =>
                                                                      ids.indexOf(
                                                                          c.id
                                                                      ) !== -1
                                                              )
                                                            : []
                                                    )
                                                }
                                            />
                                        </TableContainer>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaTemplateNewView;
