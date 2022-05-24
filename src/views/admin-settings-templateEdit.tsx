import { Card, CardContent } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTemplate, useUpdateTemplate } from '../api/hooks/useSkjemaTemplate';

import { AdminTemplateEditViewParams } from '../contracts/navigation';
import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SkjemaTemplateSchema } from '../schema/skjemaTemplate';
import { TableContainer } from '../tables/base/tableContainer';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { usePageStyles } from '../styles/kontroll/page';

const SkjemaTemplateNewView = () => {
    const { classes } = usePageStyles();

    const { templateId } = useParams<AdminTemplateEditViewParams>();
    const history = useHistory();

    const checkpointData = useCheckpoints();

    const templateData = useTemplate({ templateId: Number(templateId) });

    const updateTemplateMutation = useUpdateTemplate();

    const [selected, setSelected] = useState<Checkpoint[]>([]);

    useEffect(() => {
        if (templateData.data !== undefined) {
            setSelected(
                templateData.data.skjemaTemplateCheckpoints.map(
                    (stc) => stc.checkpoint
                )
            );
        }
    }, [templateData.data]);

    const onSaveTemplate = async (name: string): Promise<boolean> => {
        if (templateData.data !== undefined) {
            try {
                await updateTemplateMutation.mutateAsync({
                    checkpointIds: selected.map((s) => s.id),
                    name,
                    templateId: templateData.data.id
                });
            } catch (error) {
                console.log(error);
                return false;
            } finally {
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
                                <>
                                    <SkjemaTemplateSchema
                                        onSubmit={onSaveTemplate}
                                        checkpointCount={selected.length}
                                        template={templateData.data}
                                    />

                                    <TableContainer
                                        columns={columns({})}
                                        defaultColumns={defaultColumns}
                                        tableId="checkpoints">
                                        <CheckpointTable
                                            isLoading={
                                                checkpointData.isLoading ||
                                                templateData.isLoading
                                            }
                                            templateList={
                                                templateData.data
                                                    ?.skjemaTemplateCheckpoints
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaTemplateNewView;
